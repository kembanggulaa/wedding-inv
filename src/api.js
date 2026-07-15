// ============================================
// Google Apps Script API Configuration
// ============================================

// VITE_SCRIPT_ID is the Google Apps Script deployment ID
// Set via environment variable in Vercel Dashboard
const SCRIPT_ID = import.meta.env.VITE_SCRIPT_ID;
const API_BASE_URL = SCRIPT_ID
  ? `https://script.google.com/macros/s/${SCRIPT_ID}/exec`
  : 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';

/**
 * Fetch guest data by slug
 * @param {string} slug
 * @returns {Promise<Object>}
 */
export async function getGuestBySlug(slug) {
  try {
    const response = await fetch(`${API_BASE_URL}?slug=${encodeURIComponent(slug)}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching guest:', error);
    return { success: false, error: 'Gagal memuat data tamu' };
  }
}

/**
 * Submit RSVP
 * @param {Object} rsvpData
 * @param {string} rsvpData.slug
 * @param {string} rsvpData.rsvp
 * @param {number} rsvpData.jumlah
 * @returns {Promise<Object>}
 */
export async function submitRSVP(rsvpData) {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'rsvp',
        ...rsvpData
      })
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error submitting RSVP:', error);
    return { success: false, error: 'Gagal mengirim RSVP' };
  }
}

/**
 * Submit ucapan
 * @param {Object} ucapanData
 * @param {string} ucapanData.nama
 * @param {string} ucapanData.pesan
 * @returns {Promise<Object>}
 */
export async function submitUcapan(ucapanData) {
  try {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'ucapan',
        ...ucapanData
      })
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error submitting ucapan:', error);
    return { success: false, error: 'Gagal mengirim ucapan' };
  }
}

/**
 * Get all ucapan
 * @returns {Promise<Object>}
 */
export async function getUcapanList() {
  try {
    const response = await fetch(`${API_BASE_URL}?action=ucapan`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching ucapan:', error);
    return { success: false, error: 'Gagal memuat ucapan', data: [] };
  }
}
