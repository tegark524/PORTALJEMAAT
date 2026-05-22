const SS = SpreadsheetApp.getActiveSpreadsheet();

// ============================================================
// 1. ENDPOINT GET — Ambil Data
// ============================================================

function doGet(e) {
const table = e.parameter.table;
const sheet = SS.getSheetByName(table);
if (!sheet) return responseJson({ error: 'Table not found' });

const raw = sheet.getDataRange().getValues();
const headers = raw.shift();

const today = new Date();
today.setHours(0, 0, 0, 0);

let result = raw.map(row => {
const obj = {};
headers.forEach((h, i) => (obj[h] = row[i]));
return obj;
});

if (e.parameter.mode === 'public') {
result = applyPublicFilter(table, result, today);
}

return responseJson(result);
}

/\*_ Filter data untuk mode publik (jemaat / voting) _/
function applyPublicFilter(table, result, today) {
switch (table) {
case 'tb_renungan':
return result.reverse();

    case 'tb_jadwal_ibadah':
      return result.filter(r => new Date(r.tanggal) >= today);

    case 'tb_kandidat':
    case 'tb_voting_config':
      return result;

    case 'tb_suara': {
      const config = getVotingConfig();
      return config && config.is_result_published ? result : [];
    }

    default:
      return result;

}
}

// ============================================================
// 2. ENDPOINT POST — Manipulasi Data & Aksi Voting
// ============================================================

function doPost(e) {
try {
const payload = JSON.parse(e.postData.contents);
const { action } = payload;

    // --- Autentikasi ---
    if (action === 'verify_login') {
      const token = payload.id_token || payload.token || payload.access_token;
      return handleAuth(token);
    }

    const votingConfig = getVotingConfig();

    // --- Voting: Verifikasi Pemilih ---
    if (action === 'verify_voter') {
      const scheduleError = checkVotingSchedule(votingConfig);
      if (scheduleError) return responseJson({ status: 'error', message: scheduleError });

      return handleVerifyVoter(payload, votingConfig);
    }

    // --- Voting: Kirim Suara ---
    if (action === 'submit_vote') {
      const scheduleError = checkVotingSchedule(votingConfig);
      if (scheduleError) return responseJson({ status: 'error', message: scheduleError });

      return handleSubmitVote(payload);
    }

    // --- CRUD Umum ---
    const sheet = SS.getSheetByName(payload.table);
    if (!sheet) return responseJson({ status: 'error', message: 'Sheet tidak ditemukan' });

    return handleCrud(action, sheet, payload);

} catch (err) {
return responseJson({ status: 'error', message: err.toString() });
}
}

// ============================================================
// 3. HANDLER VOTING
// ============================================================

/\*_ Cek apakah waktu voting aktif. Mengembalikan pesan error atau null. _/
function checkVotingSchedule(votingConfig) {
if (!votingConfig) return null;
const now = new Date();
if (now < new Date(votingConfig.waktu_mulai)) return 'Bilik suara belum dibuka!';
if (now > new Date(votingConfig.waktu_selesai)) return 'Bilik suara telah ditutup!';
return null;
}

function handleVerifyVoter(payload, votingConfig) {
const sheetVoter = SS.getSheetByName('tb_voter');
if (!sheetVoter) return responseJson({ status: 'error', message: 'Sheet tb_voter tidak ditemukan' });

const voterId = payload.voter_id.toString().trim();
const dataVoter = sheetVoter.getDataRange().getValues();
const voter = dataVoter.find(row => row[0].toString() === voterId);
if (!voter) return responseJson({ status: 'error', message: 'ID Jemaat tidak terdaftar' });

const votes = getVotesByVoter(voterId);
const regionsVoted = getRegionsVoted(votes);

if (votes.length >= 2) {
return responseJson({ status: 'error', message: 'Anda sudah menggunakan hak suara penuh.' });
}

return responseJson({
status: 'success',
voter: { id: voter[0], nama: voter[1] },
stage: {
current: 1,
label: votingConfig?.stage1_label || 'Tahap 1',
next: votingConfig?.stage2_label || 'Tahap 2',
},
votes_cast: votes.length,
votes_remaining: Math.max(0, 2 - votes.length),
regions_voted: regionsVoted,
});
}

function handleSubmitVote(payload) {
const lock = LockService.getScriptLock();
try {
lock.waitLock(10000);

    const sheetVoter    = SS.getSheetByName('tb_voter');
    const sheetKandidat = SS.getSheetByName('tb_kandidat');
    const sheetSuara    = SS.getSheetByName('tb_suara');

    const dataVoter    = sheetVoter.getDataRange().getValues();
    const dataKandidat = sheetKandidat ? sheetKandidat.getDataRange().getValues() : [];

    const voterId = payload.voter_id.toString();
    const candidateIds = Array.isArray(payload.candidate_ids)
      ? payload.candidate_ids.map((id) => id.toString()).filter(Boolean)
      : payload.candidate_id
        ? [payload.candidate_id.toString()]
        : [];

    if (candidateIds.length === 0) {
      return responseJson({ status: 'error', message: 'Kandidat tidak ditemukan' });
    }

    const uniqueCandidateIds = [...new Set(candidateIds)];
    if (uniqueCandidateIds.length !== candidateIds.length) {
      return responseJson({ status: 'error', message: 'Kandidat duplikat tidak diizinkan' });
    }

    // Validasi pemilih
    const voterIndex = dataVoter.findIndex((row, idx) => idx > 0 && row[0].toString() === voterId);
    if (voterIndex === -1) return responseJson({ status: 'error', message: 'ID Pemilih tidak valid' });

    const kandidatRows = uniqueCandidateIds.map((candidateId) => {
      const row = dataKandidat.find((row, idx) => idx > 0 && row[0].toString() === candidateId);
      if (!row) throw new Error('Kandidat tidak ditemukan');
      return row;
    });

    const kandidatRegions = kandidatRows.map((row) => (row[4] || row[3] || '').toString().trim());
    if (kandidatRegions.some((region) => !region)) {
      return responseJson({ status: 'error', message: 'Semua kandidat harus memiliki wilayah.' });
    }

    const normalizedRegions = kandidatRegions.map((region) => region.toLowerCase());
    if (new Set(normalizedRegions).size !== normalizedRegions.length) {
      return responseJson({ status: 'error', message: 'Pilih kandidat dari wilayah yang berbeda.' });
    }

    // Validasi duplikasi suara
    const votes = getVotesByVoter(voterId);
    if (votes.length >= 2) {
      return responseJson({ status: 'error', message: 'Hak suara Anda sudah penuh.' });
    }

    const alreadyVotedRegions = votes
      .map((row) => row[3].toString().trim().toLowerCase())
      .filter(Boolean);

    const duplicateExistingRegion = normalizedRegions.some((region) => alreadyVotedRegions.includes(region));
    if (duplicateExistingRegion) {
      return responseJson({ status: 'error', message: 'Anda sudah memberikan suara untuk salah satu wilayah yang dipilih.' });
    }

    if (votes.length + uniqueCandidateIds.length > 2) {
      return responseJson({ status: 'error', message: 'Jumlah suara melebihi batas 2 suara.' });
    }

    // Rekam suara
    kandidatRows.forEach((kandidatRow, idx) => {
      const candidateId = uniqueCandidateIds[idx];
      const kandidatRegion = kandidatRegions[idx];
      sheetSuara.appendRow([
        Utilities.getUuid(),
        voterId,
        candidateId,
        kandidatRegion,
        new Date().toISOString(),
      ]);
    });

    // Tandai voter sudah memilih penuh jika suara ke-2
    if (votes.length + uniqueCandidateIds.length >= 2) {
      sheetVoter.getRange(voterIndex + 1, 3).setValue(true);
    }

    const regionsVoted = getRegionsVoted([
      ...votes,
      ...kandidatRegions.map((region) => [null, null, null, region]),
    ]);

    return responseJson({
      status: 'success',
      message: 'Suara berhasil direkam',
      votes_remaining: Math.max(0, 2 - (votes.length + uniqueCandidateIds.length)),
      regions_voted: regionsVoted,
    });

} catch (err) {
return responseJson({
status: 'error',
message: err?.message || 'Sistem sedang padat menerima suara jemaat lain. Silakan klik kirim lagi.',
});
} finally {
lock.releaseLock();
}
}

// ============================================================
// 4. HANDLER CRUD UMUM
// ============================================================

function handleCrud(action, sheet, payload) {
  if (action === 'insert') {
    const table = payload.table;
    
    // --- KHUSUS RENUNGAN: Cek pengiriman notifikasi langsung jika tayang hari ini & jam mencukupi ---
    if (table === 'tb_renungan') {
      const tipe = payload.data[7] || "UMUM";
      const tanggalTayangStr = payload.data[1]; // yyyy-MM-dd
      
      const tz = "Asia/Jakarta";
      const now = new Date();
      const currentDateStr = Utilities.formatDate(now, tz, "yyyy-MM-dd");
      const currentHour = Number(Utilities.formatDate(now, tz, "H"));
      
      let shouldSendNow = false;
      if (tanggalTayangStr <= currentDateStr) {
        let targetHour = 6; // Default
        if (tipe === 'REKAT') targetHour = 5;
        else if (tipe === 'PENGHARAPAN') targetHour = 21;
        else if (tipe === 'KELUARGA') targetHour = 18;
        else if (tipe === 'FOKUS') targetHour = 12;
        else if (tipe === 'UMUM') targetHour = 6;
        else if (tipe.indexOf('LAINNYA') === 0) {
          const parts = tipe.split(' - ');
          if (parts.length > 1) {
            targetHour = Number(parts[1].split(':')[0]) || 6;
          }
        }
        if (currentHour >= targetHour) shouldSendNow = true;
      }
      
      if (shouldSendNow && payload.data[8] !== 'SUDAH') {
        try {
          sendOneSignalNotification(table, payload.data);
          payload.data[8] = "SUDAH"; // Tandai terkirim
        } catch(e) {
          console.error("Gagal mengirim notifikasi renungan langsung: " + e.toString());
        }
      } else {
        payload.data[8] = payload.data[8] || "BELUM";
      }
    }
    
    sheet.appendRow(payload.data);
    
    // --- KHUSUS WARTA / JADWAL IBADAH: Kirim langsung jika is_headline = true ---
    if (table === 'tb_warta' || table === 'tb_jadwal_ibadah') {
      try {
        let isHeadline = false;
        if (table === 'tb_warta') {
          isHeadline = payload.data[6] === true || payload.data[6] === 'true' || payload.data[6] === 'TRUE';
        } else if (table === 'tb_jadwal_ibadah') {
          isHeadline = payload.data[7] === true || payload.data[7] === 'true' || payload.data[7] === 'TRUE';
        }
        
        if (isHeadline) {
          sendOneSignalNotification(table, payload.data);
        }
      } catch(e) {
        console.error("Gagal mengirim notifikasi headline warta/jadwal: " + e.toString());
      }
    }

    return responseJson({ status: 'success', message: 'Data berhasil ditambah' });
  }

  if (action === 'bulk_insert') {
    const rows = payload.data;
    sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, rows[0].length).setValues(rows);
    return responseJson({ status: 'success', message: `${rows.length} jemaat berhasil di-import` });
  }

  if (action === 'update') {
    const data = sheet.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0].toString() === payload.id.toString()) {
        const table = payload.table;
        
        // Cek notifikasi saat update renungan
        if (table === 'tb_renungan') {
          const tipe = payload.data[7] || "UMUM";
          const tanggalTayangStr = payload.data[1];
          
          const tz = "Asia/Jakarta";
          const now = new Date();
          const currentDateStr = Utilities.formatDate(now, tz, "yyyy-MM-dd");
          const currentHour = Number(Utilities.formatDate(now, tz, "H"));
          
          let shouldSendNow = false;
          if (tanggalTayangStr <= currentDateStr) {
            let targetHour = 6; // Default
            if (tipe === 'REKAT') targetHour = 5;
            else if (tipe === 'PENGHARAPAN') targetHour = 21;
            else if (tipe === 'KELUARGA') targetHour = 18;
            else if (tipe === 'FOKUS') targetHour = 12;
            else if (tipe === 'UMUM') targetHour = 6;
            else if (tipe.indexOf('LAINNYA') === 0) {
              const parts = tipe.split(' - ');
              if (parts.length > 1) {
                targetHour = Number(parts[1].split(':')[0]) || 6;
              }
            }
            if (currentHour >= targetHour) shouldSendNow = true;
          }
          
          if (shouldSendNow && payload.data[8] !== 'SUDAH') {
            try {
              sendOneSignalNotification(table, payload.data);
              payload.data[8] = "SUDAH";
            } catch(e) {
              console.error("Gagal mengirim notifikasi renungan langsung saat update: " + e.toString());
            }
          }
        } 
        // Kirim jika di-update menjadi headline (sebelumnya bukan headline)
        else if (table === 'tb_warta' || table === 'tb_jadwal_ibadah') {
          try {
            let isHeadline = false;
            let wasHeadline = false;
            
            if (table === 'tb_warta') {
              isHeadline = payload.data[6] === true || payload.data[6] === 'true' || payload.data[6] === 'TRUE';
              wasHeadline = data[i][6] === true || data[i][6] === 'true' || data[i][6] === 'TRUE';
            } else if (table === 'tb_jadwal_ibadah') {
              isHeadline = payload.data[7] === true || payload.data[7] === 'true' || payload.data[7] === 'TRUE';
              wasHeadline = data[i][7] === true || data[i][7] === 'true' || data[i][7] === 'TRUE';
            }
            
            if (isHeadline && !wasHeadline) {
              sendOneSignalNotification(table, payload.data);
            }
          } catch(e) {
            console.error("Gagal mengirim notifikasi warta/jadwal update: " + e.toString());
          }
        }
        
        sheet.getRange(i + 1, 1, 1, payload.data.length).setValues([payload.data]);
        return responseJson({ status: 'success', message: 'Data diperbarui' });
      }
    }
  }

if (action === 'delete') {
const data = sheet.getDataRange().getValues();
for (let i = 1; i < data.length; i++) {
if (data[i][0].toString() === payload.id.toString()) {
sheet.deleteRow(i + 1);
return responseJson({ status: 'success', message: 'Data dihapus' });
}
}
}

return responseJson({ status: 'error', message: `Action tidak dikenal: ${action}` });
}

// ============================================================
// 5. AUTENTIKASI GOOGLE
// ============================================================

function handleAuth(token) {
try {
if (!token || !token.toString().trim()) {
return responseJson({
status: 'error',
message: 'Token tidak ditemukan atau kosong. Pastikan login menggunakan akun Google.',
});
}

    const cleanToken = token.toString().trim();
    let userData = null;

    if (cleanToken.startsWith('ya29.')) {
      // Access Token
      const res = UrlFetchApp.fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        method: 'get',
        headers: { Authorization: 'Bearer ' + cleanToken },
        muteHttpExceptions: true,
      });
      if (res.getResponseCode() !== 200) {
        return responseJson({ status: 'error', message: 'Google menolak access token: ' + res.getContentText() });
      }
      userData = JSON.parse(res.getContentText());
    } else {
      // ID Token
      const res = UrlFetchApp.fetch('https://oauth2.googleapis.com/tokeninfo', {
        method: 'post',
        payload: { id_token: cleanToken },
        muteHttpExceptions: true,
      });
      if (res.getResponseCode() !== 200) {
        return responseJson({ status: 'error', message: 'Google menolak id token: ' + res.getContentText() });
      }
      userData = JSON.parse(res.getContentText());
    }

    if (!userData?.email) {
      return responseJson({
        status: 'error',
        message: 'Google tidak mengirimkan email. Izinkan akses profil saat login.',
      });
    }

    const userEmail = userData.email.trim().toLowerCase();
    const sheetAdmin = SS.getSheetByName('tb_admin_access');
    if (!sheetAdmin) {
      return responseJson({ status: 'error', message: 'Error di GAS: Sheet "tb_admin_access" belum dibuat!' });
    }

    const whitelist = sheetAdmin.getDataRange().getValues()
      .flat()
      .map(e => e.toString().trim().toLowerCase());

    if (whitelist.includes(userEmail)) {
      return responseJson({
        status: 'success',
        user: { name: userData.name, email: userEmail, picture: userData.picture },
        token: Utilities.getUuid(),
      });
    }

    return responseJson({ status: 'forbidden', message: 'Akses ditolak. Email tidak terdaftar di whitelist Majelis.' });

} catch (err) {
return responseJson({ status: 'error', message: 'Error Sistem GAS: ' + err.message });
}
}

// ============================================================
// 6. PEMBERSIHAN OTOMATIS (Time-based Trigger)
// ============================================================

function autoCleanupSystem() {
const today = new Date();
today.setHours(0, 0, 0, 0);

// Hapus renungan lebih dari 7 hari lalu
const sheetRenungan = SS.getSheetByName('tb_renungan');
if (sheetRenungan) {
const data = sheetRenungan.getDataRange().getValues();
for (let i = data.length - 1; i >= 1; i--) {
const diffDays = (today - new Date(data[i][1])) / 86400000;
if (diffDays > 7) sheetRenungan.deleteRow(i + 1);
}
}

// Hapus jadwal ibadah yang sudah lewat
const sheetJadwal = SS.getSheetByName('tb_jadwal_ibadah');
if (sheetJadwal) {
const data = sheetJadwal.getDataRange().getValues();
for (let i = data.length - 1; i >= 1; i--) {
if (new Date(data[i][2]) < today) sheetJadwal.deleteRow(i + 1);
}
}
}

// ============================================================
// HELPERS
// ============================================================

/\*_ Ambil semua suara milik seorang voter dari tb_suara _/
function getVotesByVoter(voterId) {
const sheet = SS.getSheetByName('tb_suara');
if (!sheet) return [];
const data = sheet.getDataRange().getValues();
return data.slice(1).filter(row => row[1].toString() === voterId);
}

/\*_ Ekstrak daftar wilayah unik dari array suara _/
function getRegionsVoted(votes) {
return [...new Set(
votes.map(row => (row[3] || '').toString().trim()).filter(Boolean)
)];
}

/\*_ Ambil konfigurasi voting dari sheet tb_voting_config _/
function getVotingConfig() {
const sheet = SS.getSheetByName('tb_voting_config');
if (!sheet) return null;

const data = sheet.getDataRange().getValues();
if (data.length < 2) return null;

const r = data[1];
return {
id: r[0],
judul_pemilihan: r[1],
deskripsi: r[2],
is_active: parseBool(r[3], false),
waktu_mulai: r[4],
waktu_selesai: r[5],
is_result_published: parseBool(r[6], false),
stage_count: Number(r[7]) || 2,
stage1_label: r[8] || 'Tahap 1 - Umur & Wilayah',
stage1_require_age: parseBool(r[9], true),
stage1_require_region:parseBool(r[10], true),
stage1_region_1: r[11] || '',
stage1_region_2: r[12] || '',
stage2_label: r[13] || 'Tahap 2 - Final',
};
}

/\*_ Parse nilai boolean dari berbagai representasi _/
function parseBool(value, fallback = false) {
const s = String(value).toLowerCase();
if (s === 'true') return true;
if (s === 'false') return false;
return fallback;
}

/\*_ Format response sebagai JSON _/
function responseJson(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================================
// 7. INTEGRASI PUSH NOTIFICATION ONESIGNAL
// ============================================================

/**
 * Mengirim notifikasi push otomatis saat data Renungan, Warta headline, atau Jadwal headline baru ditambahkan.
 */
function sendOneSignalNotification(table, data) {
  const appId = PropertiesService.getScriptProperties().getProperty("ONESIGNAL_APP_ID");
  const restApiKey = PropertiesService.getScriptProperties().getProperty("ONESIGNAL_REST_API_KEY");
  
  if (!appId || !restApiKey) {
    console.warn("OneSignal App ID atau REST API Key belum dikonfigurasi di Script Properties!");
    return;
  }

  let title = "GKJW Jemaat Sukolilo";
  let message = "";
  let targetUrl = "https://gkjwsukolilo.org/"; // Ubah sesuai domain aktif situs jika berbeda

  if (table === 'tb_renungan') {
    const tipe = data[7] || "UMUM";
    if (tipe === 'REKAT') {
      title = "🌅 Renungan Rekat Harian";
    } else if (tipe === 'PENGHARAPAN') {
      title = "🌙 Hidup Dalam Pengharapan";
    } else if (tipe === 'KELUARGA') {
      title = "👪 Renungan Keluarga";
    } else if (tipe === 'FOKUS') {
      title = "🎯 Fokus Hari Ini";
    } else if (tipe.indexOf('LAINNYA') === 0) {
      const parts = tipe.split(' - ');
      const timeStr = parts[1] || '06:00';
      title = "📖 Renungan Harian (" + timeStr + ")";
    } else {
      title = "📖 Renungan Harian Baru";
    }
    // data[2] = Judul, data[3] = Nats
    message = (data[2] || "Tema Hari Ini") + (data[3] ? " (" + data[3] + ")" : "");
    targetUrl += "#renungan";
  } else if (table === 'tb_warta') {
    title = "📢 Headline: Warta Jemaat";
    // data[2] = Kategori, data[3] = Judul
    const kategoriStr = data[2] ? "[" + data[2] + "] " : "";
    message = kategoriStr + (data[3] || "Informasi penting terbaru untuk jemaat.");
    targetUrl += "#beranda";
  } else if (table === 'tb_jadwal_ibadah') {
    title = "⛪ Headline: Jadwal Ibadah";
    // data[1] = Nama Ibadah, data[2] = Tanggal, data[3] = Waktu
    let tgl = data[2] || "";
    if (tgl instanceof Date) {
      tgl = Utilities.formatDate(tgl, "Asia/Jakarta", "dd MMMM yyyy");
    }
    message = "Ikuti Ibadah " + (data[1] || "") + " pada " + tgl + " Pukul " + (data[3] || "") + " WIB.";
    targetUrl += "#beranda";
  }

  const payload = {
    app_id: appId,
    included_segments: ["Subscribed Users"],
    headings: { "id": title, "en": title },
    contents: { "id": message, "en": message },
    url: targetUrl
  };

  const options = {
    method: "post",
    contentType: "application/json; charset=utf-8",
    headers: {
      "Authorization": "Basic " + restApiKey
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  try {
    const response = UrlFetchApp.fetch("https://onesignal.com/api/v1/notifications", options);
    console.log("Notifikasi terkirim: " + response.getContentText());
  } catch (err) {
    console.error("Gagal mengirim notifikasi OneSignal: " + err.toString());
  }
}

/**
 * PENTING: Jalankan fungsi ini menggunakan Time-driven Trigger setiap 30 menit atau 1 jam sekali.
 * Mengecek apakah ada renungan terjadwal yang siap dikirim notifikasinya.
 */
function checkAndSendScheduledNotifications() {
  const sheet = SS.getSheetByName('tb_renungan');
  if (!sheet) return;
  
  const tz = "Asia/Jakarta";
  const now = new Date();
  const currentDateStr = Utilities.formatDate(now, tz, "yyyy-MM-dd");
  const currentHour = Number(Utilities.formatDate(now, tz, "H"));
  
  const raw = sheet.getDataRange().getValues();
  if (raw.length < 2) return; // Kosong / Hanya header
  
  for (let i = 1; i < raw.length; i++) {
    const row = raw[i];
    const rowId = row[0];
    const tanggalTayangRaw = row[1];
    const tipe = row[7] || "UMUM";
    const statusNotif = row[8] || "BELUM";
    
    if (statusNotif === 'SUDAH' || statusNotif === 'true' || statusNotif === true) {
      continue; // Sudah dikirim
    }
    
    // Format tanggal tayang ke yyyy-MM-dd
    let tanggalTayangStr = "";
    if (tanggalTayangRaw instanceof Date) {
      tanggalTayangStr = Utilities.formatDate(tanggalTayangRaw, tz, "yyyy-MM-dd");
    } else {
      const d = new Date(tanggalTayangRaw);
      if (!isNaN(d.getTime())) {
        tanggalTayangStr = Utilities.formatDate(d, tz, "yyyy-MM-dd");
      } else {
        tanggalTayangStr = String(tanggalTayangRaw);
      }
    }
    
    // Kirim jika tanggal tayang sudah hari ini atau lewat
    if (tanggalTayangStr && tanggalTayangStr <= currentDateStr) {
      let shouldSend = false;
      let targetHour = 6; // Default
      if (tipe === 'REKAT') targetHour = 5;
      else if (tipe === 'PENGHARAPAN') targetHour = 21;
      else if (tipe === 'KELUARGA') targetHour = 18;
      else if (tipe === 'FOKUS') targetHour = 12;
      else if (tipe === 'UMUM') targetHour = 6;
      else if (tipe.indexOf('LAINNYA') === 0) {
        const parts = tipe.split(' - ');
        if (parts.length > 1) {
          targetHour = Number(parts[1].split(':')[0]) || 6;
        }
      }
      if (currentHour >= targetHour) shouldSend = true;
      
      if (shouldSend) {
        try {
          sendOneSignalNotification('tb_renungan', row);
          // Update status_notif ke SUDAH di spreadsheet (Kolom ke-9 / Kolom I)
          sheet.getRange(i + 1, 9).setValue("SUDAH");
          console.log("Notifikasi renungan terjadwal terkirim untuk ID: " + rowId);
        } catch(e) {
          console.error("Gagal mengirim notifikasi terjadwal ID: " + rowId + " - " + e.toString());
        }
      }
    }
  }
}

