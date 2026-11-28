
// src/components/GlobalBlockingOverlay.tsx
import { useSelector } from 'react-redux';
import type { RootState } from '../reducers';
import { BlockingOverlay } from './BlockingOverlay';

export const GlobalBlockingOverlay = () => {
  const { isLoading, message } = useSelector((state: RootState) => state.ui);
  return <BlockingOverlay isLoading={isLoading} text={message} />;
};
