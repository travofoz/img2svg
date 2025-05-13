/**
 * Check if a GIF file is animated
 * @param {File} file - The GIF file to check
 * @returns {Promise<boolean>} - Promise resolving to true if GIF is animated
 */
export async function isAnimatedGif(file) {
  if (file.type !== 'image/gif') return false;
  
  try {
    // Read the file as an ArrayBuffer
    const buffer = await file.arrayBuffer();
    const view = new Uint8Array(buffer);
    
    // GIF file format parsing
    // Look for multiple image descriptors (0x2C) after the initial headers
    let pos = 10; // Skip header
    
    // Skip global color table if present
    if (view[4] & 0x80) {
      pos += 3 * (1 << ((view[4] & 7) + 1));
    }
    
    let frames = 0;
    while (pos < view.length) {
      // Extension block
      if (view[pos] === 0x21) {
        pos++;
        if (view[pos] === 0xF9) { // Graphic Control Extension
          pos += 8; // Skip block
        } else if (view[pos] === 0xFF || view[pos] === 0xFE) { // Application or Comment Extension
          pos++;
          while (view[pos] !== 0) { // Skip sub-blocks
            pos += view[pos] + 1;
          }
          pos++;
        } else {
          break; // Invalid block
        }
      } 
      // Image descriptor
      else if (view[pos] === 0x2C) {
        frames++;
        if (frames > 1) return true; // More than one frame means animated
        pos += 11; // Skip image descriptor
        
        // Skip local color table if present
        if (view[pos - 2] & 0x80) {
          pos += 3 * (1 << ((view[pos - 2] & 7) + 1));
        }
        
        pos++; // Skip LZW min code size
        
        // Skip image data
        while (view[pos] !== 0) {
          pos += view[pos] + 1;
        }
        pos++;
      } 
      // Terminator
      else if (view[pos] === 0x3B) {
        break;
      } 
      // Invalid byte
      else {
        break;
      }
    }
    
    return false; // Only one frame
  } catch (error) {
    console.error('Error checking if GIF is animated:', error);
    return false; // Assume not animated in case of error
  }
}

/**
 * Check if an image file exceeds the recommended size
 * @param {File} file - The image file to check
 * @param {number} maxSizeMB - Maximum recommended size in MB
 * @returns {boolean} - True if file exceeds recommended size
 */
export function exceedsRecommendedSize(file, maxSizeMB = 5) {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size > maxSizeBytes;
}

/**
 * Get warnings for an image file
 * @param {File} file - The image file to check
 * @returns {Promise<string[]>} - Promise resolving to array of warning messages
 */
export async function getImageWarnings(file) {
  if (!file) return [];
  
  const warnings = [];
  
  // Check for animated GIFs
  if (file.type === 'image/gif' && await isAnimatedGif(file)) {
    warnings.push('This appears to be an animated GIF. Only the first frame will be traced.');
  }
  
  // Check for large file sizes
  if (exceedsRecommendedSize(file)) {
    warnings.push(`This image is larger than 5MB. Processing may be slow and result in a complex SVG.`);
  }
  
  // Check for BMP files (which can be very large)
  if (file.type === 'image/bmp' && exceedsRecommendedSize(file, 2)) {
    warnings.push('BMP files can result in complex SVGs. Consider converting to PNG before uploading for better results.');
  }
  
  return warnings;
}

/**
 * Get the appropriate image format display name
 * @param {string} mimeType - The image MIME type
 * @returns {string} - Format display name
 */
export function getImageFormatName(mimeType) {
  const formatMap = {
    'image/png': 'PNG',
    'image/jpeg': 'JPEG',
    'image/webp': 'WebP',
    'image/gif': 'GIF',
    'image/bmp': 'BMP'
  };
  
  return formatMap[mimeType] || 'Unknown';
}