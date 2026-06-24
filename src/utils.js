/**
 * Generate URL-friendly slug from name
 * Example: "Budi Santoso" -> "budi-santoso"
 * @param {string} name
 * @returns {string}
 */
export function slugify(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Get URL parameter value
 * @param {string} param
 * @returns {string|null}
 */
export function getUrlParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

/**
 * Format date to Indonesian format
 * @param {Date} date
 * @returns {string}
 */
export function formatDate(date) {
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  return date.toLocaleDateString('id-ID', options);
}

/**
 * Format datetime to Indonesian format
 * @param {string} datetime
 * @returns {string}
 */
export function formatDateTime(datetime) {
  const date = new Date(datetime);
  const options = {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return date.toLocaleDateString('id-ID', options);
}

/**
 * Show element by removing hidden class
 * @param {HTMLElement} element
 */
export function showElement(element) {
  if (element) {
    element.classList.remove('hidden');
  }
}

/**
 * Hide element by adding hidden class
 * @param {HTMLElement} element
 */
export function hideElement(element) {
  if (element) {
    element.classList.add('hidden');
  }
}
