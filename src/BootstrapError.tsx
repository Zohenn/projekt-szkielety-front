import { ErrorMessage, ErrorMessageProps } from 'formik';

export default function BootstrapError(props: ErrorMessageProps) {
  return (
    <ErrorMessage {...props} className='invalid-feedback'>
      {msg => <div className='invalid-feedback'><strong>{msg}</strong></div>}
    </ErrorMessage>
  )
}
