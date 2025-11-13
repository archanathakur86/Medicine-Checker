// frontend/src/utils/constants.js
// Frontend constants

export const MAX_FILE_SIZE_MB = 5;
export const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
export const MAX_FILES = 5;
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

export const STATUS_COLORS = {
  authentic: '#38a169',
  suspect: '#ed8936',
  counterfeit: '#e53e3e',
};

export const STATUS_LABELS = {
  authentic: 'Verified Genuine',
  suspect: 'Requires Further Inspection',
  counterfeit: 'Potentially Counterfeit',
};
