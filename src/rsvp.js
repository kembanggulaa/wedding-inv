import { submitRSVP } from './api.js';
import { showElement, hideElement } from './utils.js';

/**
 * Initialize RSVP form
 * @param {string} guestSlug - Current guest slug
 * @param {string} guestName - Current guest name
 */
export function initRSVP(guestSlug, guestName) {
  const form = document.getElementById('rsvp-form');
  const nameInput = document.getElementById('rsvp-name');
  const radioInputs = document.querySelectorAll('input[name="rsvp"]');
  const jumlahGroup = document.getElementById('jumlah-group');
  const jumlahInput = document.getElementById('rsvp-jumlah');
  const successMessage = document.getElementById('rsvp-success');

  // Pre-fill name
  if (nameInput) {
    nameInput.value = guestName || 'Tamu Undangan';
  }

  // Show/hide jumlah input based on radio selection
  radioInputs.forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (e.target.value === 'Hadir') {
        showElement(jumlahGroup);
      } else {
        hideElement(jumlahGroup);
      }
    });
  });

  // Clamp jumlah input to max 2 in real-time
  if (jumlahInput) {
    jumlahInput.addEventListener('input', () => {
      let val = parseInt(jumlahInput.value) || 1;
      if (val > 2) val = 2;
      if (val < 1) val = 1;
      jumlahInput.value = val;
    });
  }

  // Form submission
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const selectedRSVP = document.querySelector('input[name="rsvp"]:checked');

      if (!selectedRSVP) {
        alert('Silakan pilih konfirmasi kehadiran');
        return;
      }

      const rsvpValue = selectedRSVP.value;
      const jumlah = rsvpValue === 'Hadir'
        ? Math.min(2, Math.max(1, parseInt(jumlahInput.value) || 1))
        : 0;

      // Show loading state
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Mengirim...';
      submitBtn.disabled = true;

      try {
        const result = await submitRSVP({
          slug: guestSlug,
          rsvp: rsvpValue,
          jumlah: jumlah
        });

        if (result.success) {
          hideElement(form);
          showElement(successMessage);
        } else {
          alert(result.error || 'Gagal mengirim RSVP. Silakan coba lagi.');
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }
      } catch (error) {
        console.error('RSVP error:', error);
        alert('Terjadi kesalahan. Silakan coba lagi.');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }
}
