import { ToastItem } from '../hooks/useToasts';
import { Toast } from 'react-bootstrap';

interface ToastsProps {
  toasts: ToastItem[];
  removeToast: (toast: ToastItem) => void;
}

export default function Toasts({ toasts, removeToast}: ToastsProps) {
  return (
    <div className='toast-container position-fixed bottom-0 end-0 p-3' style={{ zIndex: 11 }}>
      {toasts.map((toast) =>
        <Toast key={toast.id}
               autohide={true}
               bg={toast.bg}
               className='align-items-center text-white border-0'
               delay={3000}
               onClose={() => removeToast(toast)}
               show={toast.show}>
          <div className='d-flex'>
            <div className='toast-body'>{toast.message}</div>
            <button type='button'
                    className='btn-close btn-close-white me-2 m-auto'
                    data-bs-dismiss='toast'
                    aria-label='Close'/>
          </div>
        </Toast>
      )}
    </div>
  )
}
