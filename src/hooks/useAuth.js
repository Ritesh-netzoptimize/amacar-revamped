import { useDispatch, useSelector } from 'react-redux';
import { setFormValue, setFormError, resetForm } from '@/redux/slices/userSlice';

export default function useAuth() {
  const dispatch = useDispatch();
  const { form } = useSelector((state) => state.user);

  const setValue = (key, value) => {
    dispatch(setFormValue({ key, value }));
  };

  const setError = (key, error) => {
    dispatch(setFormError({ key, error }));
  };

  const reset = () => {
    dispatch(resetForm());
  };

  return { values: form.values, errors: form.errors, setValue, setError, resetForm: reset };
}
