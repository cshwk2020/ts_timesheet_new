 
const BASE_URL = 'http://localhost:8000/api';

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export const apiClient = async (endpoint: string, options: RequestInit = {}) => {
  // Read from localStorage so this function works inside or outside React components
  const token = localStorage.getItem('auth_token');
  const userStr = localStorage.getItem('user_info');
  const userId = userStr ? JSON.parse(userStr).user_id : null;

  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(userId ? { 'X-User-Id': userId } : {}), // 👈 Inject user_id header here
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {

    const errorData = await response.json().catch(() => ({}));
    console.error(`API Error [${response.status}] on ${endpoint}:`, errorData);

    if (response.status === 401) {
       
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_info');
      window.dispatchEvent(new Event('auth_expired'));
    }
    throw new ApiError(response.status, data.error || 'Something went wrong');
  }

  return data;
};