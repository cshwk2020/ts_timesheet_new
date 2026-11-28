import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../reducers';
import { X } from 'lucide-react';
import './ErrorModal.css';

export const ErrorModal = () => {
  const dispatch = useDispatch();
  const errorMsg = useSelector((state: RootState) => state.error.message);

  if (!errorMsg) return null;

  return (
    <div className="error-banner">
      <span>{errorMsg}</span>
      <button onClick={() => dispatch({ type: 'CLEAR_ERROR' })}>
        <X size={18} />
      </button>
    </div>
  );
};