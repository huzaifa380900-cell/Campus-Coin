import Swal from 'sweetalert2';

const isDarkMode = () => document.documentElement.dataset.theme === 'dark';

export const swalColors = () => ({
  background: isDarkMode() ? '#182136' : '#ffffff',
  color: isDarkMode() ? '#eff4ff' : '#131b2e',
  confirmButtonColor: '#d97706',
  cancelButtonColor: '#64748b',
});

export function notifySuccess(title, text = '') {
  return Swal.fire({
    icon: 'success',
    title,
    text,
    timer: 2500,
    showConfirmButton: false,
    ...swalColors(),
  });
}

export function notifyError(title, text = '') {
  return Swal.fire({
    icon: 'error',
    title,
    text,
    confirmButtonText: 'OK',
    ...swalColors(),
  });
}

export async function confirmDialog(options = {}) {
  const result = await Swal.fire({
    title: options.title || 'Are you sure?',
    text: options.text || 'This action cannot be undone.',
    icon: options.icon || 'warning',
    showCancelButton: true,
    confirmButtonText: options.confirmButtonText || 'Yes, proceed',
    cancelButtonText: options.cancelButtonText || 'Cancel',
    reverseButtons: true,
    ...swalColors(),
  });
  return result.isConfirmed;
}

export function showLoading(title = 'Processing...', text = 'Please wait') {
  Swal.fire({
    title,
    text,
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
    ...swalColors(),
  });
}

export function closeLoading() {
  Swal.close();
}
