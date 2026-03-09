import Swal from 'sweetalert2';

const useSweetAlert = () => {
  const confirm = async (title, icon = 'warning', html = '') => {
    const result = await Swal.fire({
      title,
      icon,
      html,
      showCancelButton: true,
      confirmButtonText: '確定',
      cancelButtonText: '取消',
      customClass: {
        confirmButton: 'btn btn-primary',
        cancelButton: 'btn btn-outline-secondary'
      }
    });

    return result.isConfirmed;
  };

  const alert = (title, icon = 'success', html = '', timer = 2000) => {
    Swal.fire({
      title,
      icon,
      html,
      showConfirmButton: false,
      timer
    });
  };

  return { confirm, alert };
}

export default useSweetAlert;