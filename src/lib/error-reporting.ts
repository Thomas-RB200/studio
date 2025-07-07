export const ERROR_STORAGE_KEY = 'padelAppError';

export interface AppErrorEvent {
  id: string;
  message: string;
  timestamp: number;
}

export const reportError = (error: Error) => {
  console.error("Reporting error:", error);
  const newError: AppErrorEvent = {
    id: `err-${Date.now()}`,
    message: error.message || 'An unknown error occurred on a client page.',
    timestamp: Date.now(),
  };
  try {
    // Using setItem will trigger 'storage' event in other tabs
    localStorage.setItem(ERROR_STORAGE_KEY, JSON.stringify(newError));
  } catch (e) {
    console.error("Failed to report error to localStorage", e);
  }
};
