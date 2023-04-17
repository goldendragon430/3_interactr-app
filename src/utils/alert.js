import Swal from 'sweetalert2';
import {toast} from "react-toastify";

export function info(args){
  const {title, text} = args;

  Swal.fire({
    title,
    text,
    icon: 'info',
    confirmButtonText: 'OK'
  })
}

export function confirm(args) {
  const {title, text, onConfirm} = args;
  let {confirmButtonText}  = args;

  if (! confirmButtonText) {
    confirmButtonText = 'Yes';
  }

  Swal.fire({
    title,
    text,
    icon: 'warning',
    showCloseButton: true,
    showCancelButton: true,
    confirmButtonColor: '#ff6961',
    confirmButtonText,
  }).then((result) => {
    if(result.isConfirmed) {
      onConfirm();
    }
  });

}

export function success(message) {
  toast.success(message, {
    position: 'top-right',
    theme:"colored"
  });
}

export function error(args){
  let {title, text} = args;

  if (! title) {
    title = 'Error!'
  }
  
  Swal.fire({
    title,
    text,
    icon: 'error',
    confirmButtonText: 'OK',
  })
}

export const errorAlert = (args) => {
  let {title, text} = args;

  if (! title) {
    title = 'Error!'
  }

  Swal.fire({
    title,
    text,
    icon: 'error',
    confirmButtonText: 'OK'
  })
};