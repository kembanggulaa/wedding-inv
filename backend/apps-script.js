// ============================================
// GOOGLE APPS SCRIPT - Wedding Invitation API
// ============================================
//
// INSTRUCTIONS:
// 1. Create a new Google Sheet
// 2. Add two sheets: "Tamu" and "Ucapan"
// 3. In "Tamu" sheet, add headers: Nama, Slug, RSVP, Jumlah, Ucapan
// 4. In "Ucapan" sheet, add headers: Nama, Pesan, Timestamp
// 5. Go to Extensions > Apps Script
// 6. Delete default code and paste this entire file
// 7. Click Deploy > New Deployment > Web App
// 8. Set access to "Anyone"
// 9. Copy the Web App URL
// 10. Paste URL in frontend src/api.js
// ============================================

const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID'; // Replace with your spreadsheet ID

/**
 * Handle GET requests
 */
function doGet(e) {
  const action = e.parameter.action;
  const slug = e.parameter.slug;

  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  try {
    if (slug) {
      // Get guest by slug
      const guest = getGuestBySlug(slug);
      if (guest) {
        return jsonResponse({ success: true, data: guest }, headers);
      } else {
        return jsonResponse({ success: false, error: 'Tamu tidak ditemukan' }, headers, 404);
      }
    } else if (action === 'ucapan') {
      // Get all ucapan
      const ucapanList = getUcapanList();
      return jsonResponse({ success: true, data: ucapanList }, headers);
    } else {
      return jsonResponse({ success: false, error: 'Invalid request' }, headers, 400);
    }
  } catch (error) {
    return jsonResponse({ success: false, error: error.toString() }, headers, 500);
  }
}

/**
 * Handle POST requests
 */
function doPost(e) {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;

    if (action === 'rsvp') {
      return handleRSVP(data, headers);
    } else if (action === 'ucapan') {
      return handleUcapan(data, headers);
    } else {
      return jsonResponse({ success: false, error: 'Invalid action' }, headers, 400);
    }
  } catch (error) {
    return jsonResponse({ success: false, error: error.toString() }, headers, 500);
  }
}

/**
 * Handle RSVP submission
 */
function handleRSVP(data, headers) {
  const slug = data.slug;
  const rsvp = data.rsvp;
  const jumlah = data.jumlah;

  if (!slug || !rsvp) {
    return jsonResponse({ success: false, error: 'Data tidak lengkap' }, headers, 400);
  }

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('Tamu');
  const data_range = sheet.getDataRange();
  const values = data_range.getValues();

  // Find guest by slug (column B, index 1)
  let rowIndex = -1;
  for (let i = 1; i < values.length; i++) {
    if (values[i][1] === slug) {
      rowIndex = i + 1; // +1 because sheet rows are 1-indexed
      break;
    }
  }

  if (rowIndex === -1) {
    return jsonResponse({ success: false, error: 'Tamu tidak ditemukan' }, headers, 404);
  }

  // Check if RSVP already exists
  const existingRSVP = values[rowIndex - 1][2];
  if (existingRSVP && existingRSVP !== '') {
    return jsonResponse({ success: false, error: 'RSVP sudah pernah disubmit' }, headers, 409);
  }

  // Update RSVP
  sheet.getRange(rowIndex, 3).setValue(rsvp); // Column C: RSVP
  sheet.getRange(rowIndex, 4).setValue(jumlah || ''); // Column D: Jumlah

  return jsonResponse({ success: true, message: 'RSVP berhasil disimpan' }, headers);
}

/**
 * Handle Ucapan submission
 */
function handleUcapan(data, headers) {
  const nama = data.nama;
  const pesan = data.pesan;

  if (!nama || !pesan) {
    return jsonResponse({ success: false, error: 'Data tidak lengkap' }, headers, 400);
  }

  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('Ucapan');

  // Add new row
  const timestamp = new Date();
  sheet.appendRow([nama, pesan, timestamp]);

  return jsonResponse({ success: true, message: 'Ucapan berhasil dikirim' }, headers);
}

/**
 * Get guest by slug
 */
function getGuestBySlug(slug) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('Tamu');
  const data_range = sheet.getDataRange();
  const values = data_range.getValues();

  for (let i = 1; i < values.length; i++) {
    if (values[i][1] === slug) {
      return {
        nama: values[i][0],
        slug: values[i][1],
        rsvp: values[i][2] || '',
        jumlah: values[i][3] || '',
        ucapan: values[i][4] || ''
      };
    }
  }

  return null;
}

/**
 * Get all ucapan sorted by newest first
 */
function getUcapanList() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('Ucapan');
  const data_range = sheet.getDataRange();
  const values = data_range.getValues();

  const ucapanList = [];

  for (let i = 1; i < values.length; i++) {
    ucapanList.push({
      nama: values[i][0],
      pesan: values[i][1],
      timestamp: values[i][2] ? values[i][2].toISOString() : ''
    });
  }

  // Sort by newest first
  ucapanList.reverse();

  return ucapanList;
}

/**
 * Generate JSON response
 */
function jsonResponse(data, headers, statusCode) {
  const response = ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);

  // Note: In newer Apps Script versions, you may need to use different method for headers
  return response;
}

/**
 * Generate slugs for all guests (run once after adding names)
 */
function generateSlugs() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('Tamu');
  const data_range = sheet.getDataRange();
  const values = data_range.getValues();

  for (let i = 1; i < values.length; i++) {
    const nama = values[i][0];
    if (nama && !values[i][1]) {
      const slug = slugify(nama);
      sheet.getRange(i + 1, 2).setValue(slug);
    }
  }
}

/**
 * Generate URL-friendly slug
 */
function slugify(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
