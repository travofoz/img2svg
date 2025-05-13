/**
 * Check if the browser supports required features
 * @returns {Object} Object containing compatibility flags
 */
export function checkBrowserCompatibility() {
  return {
    // Check for Canvas API support (needed for image processing)
    canvasSupport: 
      typeof document !== 'undefined' && 
      !!document.createElement('canvas').getContext,
    
    // Check for FileReader API support (needed for file uploads)
    fileReaderSupport: 
      typeof FileReader !== 'undefined',
    
    // Check for Clipboard API support (needed for paste from clipboard)
    clipboardSupport: 
      typeof navigator !== 'undefined' && 
      navigator.clipboard && 
      typeof navigator.clipboard.read === 'function',
      
    // Check for Blob API support (needed for downloads)
    blobSupport:
      typeof Blob !== 'undefined' && 
      typeof URL !== 'undefined' && 
      typeof URL.createObjectURL === 'function'
  };
}

/**
 * Display browser compatibility warnings
 * @param {Object} compatibility - Compatibility flags
 * @returns {Array} Array of warning messages
 */
export function getCompatibilityWarnings(compatibility = null) {
  const checks = compatibility || checkBrowserCompatibility();
  const warnings = [];
  
  if (!checks.canvasSupport) {
    warnings.push('Your browser does not support the Canvas API, which is required for image processing.');
  }
  
  if (!checks.fileReaderSupport) {
    warnings.push('Your browser does not support the FileReader API, which is required for file uploads.');
  }
  
  if (!checks.clipboardSupport) {
    warnings.push('Your browser does not fully support the Clipboard API. Paste from clipboard may not work.');
  }
  
  if (!checks.blobSupport) {
    warnings.push('Your browser does not support the Blob API, which is required for downloading SVG files.');
  }
  
  return warnings;
}

/**
 * Check if all required features are supported
 * @returns {boolean} True if all required features are supported
 */
export function hasMinimumCompatibility() {
  const { canvasSupport, fileReaderSupport, blobSupport } = checkBrowserCompatibility();
  
  // Clipboard support is optional, but canvas, FileReader and Blob are required
  return canvasSupport && fileReaderSupport && blobSupport;
}