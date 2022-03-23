import { FormikErrors } from 'formik';

export default function disableSubmitButton(isSubmitting: boolean, errors: FormikErrors<unknown>) {
  return isSubmitting || Object.values(errors).some((error) => !!error);
}
