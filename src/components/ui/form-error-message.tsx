
import type { FieldError, Merge } from 'react-hook-form'

const FormErrorMessage = ({error}:{error:Merge<FieldError, (FieldError | undefined)[]> | undefined}) => {
   const fieldError = Array.isArray(error) ? error.find(e => e?.type === 'manual') : error;
   let message = fieldError?.message || '';
   
    if (!message) {
        return null;
    }
  return (
    <p className='text-sm text-destructive'>{message}</p>
  )
}

export default FormErrorMessage