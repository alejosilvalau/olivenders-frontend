import Swal from 'sweetalert2';


export function alertMethod(title: string, message: string, type: any) {
  return Swal.fire({
    title: title,
    text: message,
    icon: type,
    customClass: {
      popup: 'custom-swal-popup',
      title: 'custom-swal-title',
      confirmButton: 'custom-swal-confirm',
    }
    })
}
