import { submitUcapan, getUcapanList } from './api.js';
import { formatDateTime } from './utils.js';

/**
 * Initialize Ucapan form and list
 * @param {string} guestName - Current guest name
 */
export function initUcapan(guestName) {
  const form = document.getElementById('ucapan-form');
  const nameInput = document.getElementById('ucapan-name');
  const listContainer = document.getElementById('ucapan-list');

  // Pre-fill name
  if (nameInput) {
    nameInput.value = guestName || 'Tamu Undangan';
  }

  // Load existing ucapan
  loadUcapanList(listContainer);

  // Form submission
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const pesanInput = document.getElementById('ucapan-pesan');
      const pesan = pesanInput.value.trim();

      if (!pesan) {
        alert('Silakan tulis ucapan atau doa');
        return;
      }

      // Show loading state
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Mengirim...';
      submitBtn.disabled = true;

      try {
        const result = await submitUcapan({
          nama: nameInput.value,
          pesan: pesan
        });

        if (result.success) {
          pesanInput.value = '';
          // Reload list
          await loadUcapanList(listContainer);
          // Show success feedback
          submitBtn.textContent = 'Terkirim!';
          setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
          }, 2000);
        } else {
          alert(result.error || 'Gagal mengirim ucapan. Silakan coba lagi.');
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }
      } catch (error) {
        console.error('Ucapan error:', error);
        alert('Terjadi kesalahan. Silakan coba lagi.');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }
}

/**
 * Load and display ucapan list
 * @param {HTMLElement} container
 */
async function loadUcapanList(container) {
  if (!container) return;

  // Show loading
  container.innerHTML = '<p class="ucapan-loading">Memuat ucapan...</p>';
  setUcapanListVisible(true);

  try {
    const result = await getUcapanList();

    if (result.success && result.data && result.data.length > 0) {
      renderUcapanList(container, result.data);
      setUcapanListVisible(true);
    } else {
      container.innerHTML = '';
      setUcapanListVisible(false);
    }
  } catch (error) {
    console.error('Error loading ucapan:', error);
    container.innerHTML = '<p class="ucapan-empty">Gagal memuat ucapan.</p>';
    setUcapanListVisible(true);
  }
}

/**
 * Show/hide ucapan list title and divider
 * @param {boolean} visible
 */
function setUcapanListVisible(visible) {
  const title = document.querySelector('.ucapan-list-title');
  const divider = document.querySelector('.ucapan-divider');
  if (title) title.classList.toggle('hidden', !visible);
  if (divider) divider.classList.toggle('hidden', !visible);
}

/**
 * Render ucapan items
 * @param {HTMLElement} container
 * @param {Array} ucapanList
 */
function renderUcapanList(container, ucapanList) {
  container.innerHTML = '';

  ucapanList.forEach((ucapan) => {
    const item = document.createElement('div');
    item.className = 'ucapan-item';
    item.innerHTML = `
      <div class="ucapan-item-name">${escapeHtml(ucapan.nama)}</div>
      <div class="ucapan-item-text">${escapeHtml(ucapan.pesan)}</div>
      <div class="ucapan-item-time">${formatDateTime(ucapan.timestamp)}</div>
    `;
    container.appendChild(item);
  });
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text
 * @returns {string}
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
