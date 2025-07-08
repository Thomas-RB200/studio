export const ERROR_STORAGE_KEY = 'padelAppErrors_v1';
const MAX_ERRORS = 50;

export interface AppErrorEvent {
  id: string;
  message: string;
  timestamp: number;
}

export const reportError = (error: Error) => {
  console.error("Reporting error:", error);

  const newError: AppErrorEvent = {
    id: `err-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`, // Add randomness to prevent collisions
    message: error.message || 'An unknown error occurred on a client page.',
    timestamp: Date.now(),
  };

  try {
    const existingErrorsJSON = localStorage.getItem(ERROR_STORAGE_KEY);
    let existingErrors: AppErrorEvent[] = [];
    if (existingErrorsJSON) {
      try {
        existingErrors = JSON.parse(existingErrorsJSON);
        if (!Array.isArray(existingErrors)) {
            existingErrors = []; // Reset if storage is corrupted
        }
      } catch (e) {
        console.warn("Could not parse existing errors from localStorage", e);
        existingErrors = [];
      }
    }
    
    // Add the new error and keep the list at a manageable size
    const updatedErrors = [newError, ...existingErrors].slice(0, MAX_ERRORS);
    
    // Using setItem will trigger 'storage' event in other tabs
    localStorage.setItem(ERROR_STORAGE_KEY, JSON.stringify(updatedErrors));
  } catch (e) {
    console.error("Failed to report error to localStorage", e);
  }
};
