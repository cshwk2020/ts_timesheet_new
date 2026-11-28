import { ApiError } from '../api/client';
import { ErrorMessages } from '../constants/errorMessages';

/**
 * Extracts a readable error message from an unknown error object.
 * If it's a network error (status 0), it returns the generic NETWORK message.
 * Otherwise, it returns the specific fallback message you pass in.
 */
export const getErrorMessage = (error: unknown, fallbackMsg: string = ErrorMessages.NETWORK): string => {
  if (error instanceof ApiError) {
    // If the server is down (status 0), always show the network error
    if (error.status === 0) {
      return ErrorMessages.NETWORK;
    }
    // If Laravel sent a specific validation message, use it. Otherwise use fallback.
    return error.message || fallbackMsg;
  }
  
  // For standard JS errors (e.g., TypeError)
  return fallbackMsg;
};