# Voting System Development Guide (GKJW Sukolilo)

## Project Context

Build a seasonal voting feature for church elders. Uses Vue 3, Pinia, and Google Apps Script.

## UI/UX Rules

- Primary Color: #800000 (Maroon).
- Typography: Playfair Display (Serif) for headings, Inter/Sans for body.
- Transitions: Use Tailwind transition/animate-spin for loading feedbacks.

## Modules to Build

1. **Voter Login Component**:
   - Route: `/voting/login`[cite: 1].
   - Input: NIK/NIJ unique ID[cite: 1].
   - Logic: Validate via GAS. On success, store session in `localStorage.gkjw_voter_session`[cite: 1].

2. **Digital Voting Booth**:
   - Route: `/voting/dashboard` (Protected by voter session)[cite: 1].
   - Display: Grid of `tb_kandidat` using cards[cite: 1].
   - Action: Post vote to GAS, then auto-logout voter and clear session[cite: 1].

3. **Admin - Voter Management**:
   - Features: Search voter, check status, and Bulk Import[cite: 1].
   - Bulk Import Logic: Textarea for Excel paste -> Parse by `\n` and `\t` -> Send array to GAS[cite: 1].

4. **Admin - Live Count Dashboard**:
   - Visual: Bar chart or progress bars showing real-time counts from `tb_suara`[cite: 1].

## Technical Constraints

- API Interaction: Always use `axios.post` with `headers: { 'Content-Type': 'text/plain' }`[cite: 1].
- Data Fetching: Use "Load Once" strategy via `churchStore.js`[cite: 1].
- Security: Voter login is separate from Admin Google OAuth session[cite: 1].

kode GAS SAYA
const SS = SpreadsheetApp.getActiveSpreadsheet();

/\*\*

- 1.  FUNGSI UNTUK MENGAMBIL DATA (GET)
      \*/
      function doGet(e) {
      const table = e.parameter.table;
      const sheet = SS.getSheetByName(table);
      if (!sheet) return responseJson({"error": "Table not found"});

const data = sheet.getDataRange().getValues();
const headers = data.shift();
const today = new Date();
today.setHours(0,0,0,0);

let result = data.map(row => {
let obj = {};
headers.forEach((h, i) => obj[h] = row[i]);
return obj;
});

// LOGIKA FILTERING UNTUK JEMAAT (Landing Page & Voting)
if (e.parameter.mode === 'public') {
if (table === 'tb_renungan') {
result = result.filter(r => new Date(r.tanggal_tayang) <= today).reverse().slice(0, 7);
}

    if (table === 'tb_jadwal_ibadah') {
      result = result.filter(r => new Date(r.tanggal) >= today);
    }

    // Untuk voting, ambil semua kandidat yang tersedia
    if (table === 'tb_kandidat' || table === 'tb_voting_config') {
      return responseJson(result);
    }

}

return responseJson(result);
}

/\*\*

- 2.  FUNGSI UNTUK MANIPULASI DATA (POST)
      \*/
      function doPost(e) {
      try {
      const payload = JSON.parse(e.postData.contents);
      const action = payload.action;

          // A. LOGIKA AUTHENTICATION (Admin & Voter)
          if (action === 'verify_login') return handleAuth(payload.id_token);

          // Verifikasi Pemilih (Jemaat)
          if (action === 'verify_voter') {
            const sheet = SS.getSheetByName('tb_voter');
            const data = sheet.getDataRange().getValues();
            const voterId = payload.voter_id.toString().trim();

            const voter = data.find(row => row[0].toString() === voterId);
            if (!voter) return responseJson({"status": "error", "message": "ID Jemaat tidak terdaftar"});

            const sudahMemilih = voter[2] === true || voter[2] === "TRUE" || String(voter[2]).toLowerCase() === 'true';
            if (sudahMemilih) return responseJson({"status": "error", "message": "Anda sudah menggunakan hak suara"});

            return responseJson({"status": "success", "voter": { id: voter[0], nama: voter[1] }});
          }

          // B. LOGIKA VOTING (Submit Suara)
          if (action === 'submit_vote') {
            const sheetVoter = SS.getSheetByName('tb_voter');
            const sheetSuara = SS.getSheetByName('tb_suara');
            const dataVoter = sheetVoter.getDataRange().getValues();

            // Keamanan: Cek ulang apakah sudah memilih di sisi server
            for (let i = 1; i < dataVoter.length; i++) {
              if (dataVoter[i][0].toString() === payload.voter_id.toString()) {
                if (dataVoter[i][2] === true || dataVoter[i][2] === "TRUE") {
                  return responseJson({"status": "error", "message": "Kecurangan terdeteksi: Anda sudah memilih"});
                }
                // 1. Catat Suara (Anonim)
                sheetSuara.appendRow([Utilities.getUuid(), payload.candidate_id, new Date().toISOString()]);
                // 2. Tandai Pemilih
                sheetVoter.getRange(i + 1, 3).setValue(true);
                return responseJson({"status": "success", "message": "Suara berhasil direkam"});
              }
            }
            return responseJson({"status": "error", "message": "ID Pemilih tidak valid"});
          }

          // C. LOGIKA CRUD & BULK INSERT
          const sheet = SS.getSheetByName(payload.table);
          if (!sheet) return responseJson({"status": "error", "message": "Sheet tidak ditemukan"});

          if (action === 'insert') {
            sheet.appendRow(payload.data);
            return responseJson({"status": "success", "message": "Data berhasil ditambah"});
          }

          if (action === 'bulk_insert') {
            const dataToInsert = payload.data; // Array 2D [[id, nama, status, ts], ...]
            sheet.getRange(sheet.getLastRow() + 1, 1, dataToInsert.length, dataToInsert[0].length).setValues(dataToInsert);
            return responseJson({"status": "success", "message": dataToInsert.length + " jemaat berhasil di-import"});
          }

          if (action === 'update') {
            const data = sheet.getDataRange().getValues();
            for (let i = 1; i < data.length; i++) {
              if (data[i][0].toString() === payload.id.toString()) {
                sheet.getRange(i + 1, 1, 1, payload.data.length).setValues([payload.data]);
                return responseJson({"status": "success", "message": "Data diperbarui"});
              }
            }
          }

          if (action === 'delete') {
            const data = sheet.getDataRange().getValues();
            for (let i = 1; i < data.length; i++) {
              if (data[i][0].toString() === payload.id.toString()) {
                sheet.deleteRow(i + 1);
                return responseJson({"status": "success", "message": "Data dihapus"});
              }
            }
          }

          return responseJson({"status": "error", "message": "Action unknown: " + action});

      } catch (err) {
      return responseJson({"status": "error", "message": err.toString()});
      }
      }
      /\*\*

- HELPER: Verifikasi ID Token Google & Cek Whitelist
  \*/
  function handleAuth(idToken) {
  try {
  // 1. Pastikan token dibersihkan dari spasi / karakter enter tersembunyi
  const cleanToken = idToken.toString().trim();

      // 2. Gunakan URL tokeninfo dasar
      const authUrl = 'https://oauth2.googleapis.com/tokeninfo';

      // 3. Gunakan method POST dan payload agar tidak error "Argumen tidak valid"
      const options = {
        method: 'post',
        payload: {
          id_token: cleanToken
        },
        muteHttpExceptions: true
      };

      const authResponse = UrlFetchApp.fetch(authUrl, options);

      // 4. Cek respon otentikasi dari Google
      if (authResponse.getResponseCode() !== 200) {
        return responseJson({
          status: 'error',
          message: 'Google menolak token: ' + authResponse.getContentText()
        });
      }

      const userData = JSON.parse(authResponse.getContentText());
      const userEmail = userData.email.trim().toLowerCase();

      // 5. Cek keberadaan sheet tb_admin_access
      const sheet = SS.getSheetByName('tb_admin_access');
      if (!sheet) {
        return responseJson({
          status: 'error',
          message: 'Error di GAS: Sheet "tb_admin_access" belum dibuat!'
        });
      }

      // 6. Validasi Whitelist (Cek email di Spreadsheet)
      const whitelist = sheet.getDataRange().getValues().flat().map(email => email.toString().trim().toLowerCase());

      if (whitelist.includes(userEmail)) {
        return responseJson({
          status: 'success',
          user: {
            name: userData.name,
            email: userEmail,
            picture: userData.picture
          },
          token: Utilities.getUuid() // Token sesi sementara
        });
      } else {
        return responseJson({
          status: 'forbidden',
          message: 'Akses ditolak. Email tidak terdaftar di whitelist Majelis.'
        });
      }

  } catch (e) {
  return responseJson({
  status: 'error',
  message: 'Error Sistem GAS: ' + e.message
  });
  }
  }

/\*\*

- HELPER: Format Response JSON
  \*/
  function responseJson(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
  .setMimeType(ContentService.MimeType.JSON);
  }

/\*\*

- 3.  SISTEM PEMBERSIHAN OTOMATIS (Trigger Berkala)
      \*/
      function autoCleanupSystem() {
      const today = new Date();
      today.setHours(0,0,0,0);

// Cleanup tb_renungan (Hanya simpan 7 hari terakhir)
const sheetRenungan = SS.getSheetByName('tb_renungan');
if (sheetRenungan) {
const dataRenungan = sheetRenungan.getDataRange().getValues();
for (let i = dataRenungan.length - 1; i >= 1; i--) {
const tgl = new Date(dataRenungan[i][1]); // Kolom tanggal_tayang
const diffDays = (today - tgl) / (1000 _ 60 _ 60 \* 24);
if (diffDays > 7) sheetRenungan.deleteRow(i + 1);
}
}

// Cleanup tb_jadwal_ibadah (Hapus yang sudah basi)
const sheetJadwal = SS.getSheetByName('tb_jadwal_ibadah');
if (sheetJadwal) {
const dataJadwal = sheetJadwal.getDataRange().getValues();
for (let i = dataJadwal.length - 1; i >= 1; i--) {
const tglIbadah = new Date(dataJadwal[i][2]); // Kolom tanggal
if (tglIbadah < today) sheetJadwal.deleteRow(i + 1);
}
}
}
