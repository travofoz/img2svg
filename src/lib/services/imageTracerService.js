import ImageTracer from 'imagetracerjs';

/**
 * Convert an image to SVG using ImageTracerJS
 * @param {ImageData} imageData - The image data to trace
 * @param {Object} options - Tracing options
 * @returns {Promise<string>} - Promise resolving to SVG string
 */
export async function traceImage(imageData, options = {}) {
  return new Promise((resolve, reject) => {
    try {
      // Apply preset or custom options
      let traceOptions = options.preset && options.preset !== 'custom'
        ? ImageTracer.optionpresets[options.preset]
        : {
            // Line threshold - smaller values produce more detailed traces
            ltres: options.ltres || 1,
            
            // Quadratic threshold - smaller values produce more detailed traces
            qtres: options.qtres || 1,
            
            // Path omit threshold - eliminates paths shorter than this
            pathomit: options.pathomit || 8,
            
            // Color sampling method (1: random sampling, 2: deterministic sampling)
            colorsampling: options.colorsampling || 2,
            
            // Number of colors to use in trace
            numberofcolors: options.numberofcolors || 16,
            
            // Minimum color ratio
            mincolorratio: options.mincolorratio || 0.02,
            
            // Color quantization cycles
            colorquantcycles: options.colorquantcycles || 3,
            
            // Edge detection - blur radius
            blurradius: options.blurradius || 0,
            
            // Edge detection - blur delta
            blurdelta: options.blurdelta || 20,
            
            // Scaling the SVG output
            scale: options.scale || 1,
            
            // Coordinate rounding (1: rounddown, 2: roundup, 3: nearest)
            roundcoords: options.roundcoords || 1,
            
            // Line filter
            linefilter: options.linefilter || false,
            
            // Stroke width
            strokewidth: options.strokewidth || 1
          };
      
      // Process the image
      const svgString = ImageTracer.imagedataToSVG(imageData, traceOptions);
      
      // Parse and extract statistics
      const stats = extractSvgStats(svgString, imageData);
      
      resolve({ svgString, stats });
    } catch (error) {
      console.error('Error tracing image:', error);
      reject(error);
    }
  });
}

/**
 * Extract statistics from an SVG string
 * @param {string} svgString - The SVG string to analyze
 * @param {ImageData} imageData - Original image data
 * @returns {Object} - SVG statistics
 */
function extractSvgStats(svgString, imageData) {
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
  
  // Find all path elements
  const paths = svgDoc.querySelectorAll('path');
  
  // Count total nodes in all paths
  let nodeCount = 0;
  paths.forEach(path => {
    // Count nodes (command points) in the path data
    const d = path.getAttribute('d') || '';
    // Simple estimation - count all alphabetic characters
    const commands = d.match(/[A-Za-z]/g) || [];
    nodeCount += commands.length;
  });
  
  // Calculate size in KB
  const sizeInBytes = new Blob([svgString], { type: 'image/svg+xml' }).size;
  const sizeInKB = (sizeInBytes / 1024).toFixed(2);
  
  return {
    width: imageData.width,
    height: imageData.height,
    paths: paths.length,
    nodes: nodeCount,
    size: `${sizeInKB}KB`
  };
}

/**
 * Create an ImageData object from a File or Blob
 * @param {File|Blob} file - The image file
 * @returns {Promise<ImageData>} - Promise resolving to ImageData
 */
export async function createImageDataFromFile(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      // Create a canvas to draw the image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Set canvas size to match image
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw image on canvas
      ctx.drawImage(img, 0, 0);
      
      // Get image data
      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        resolve(imageData);
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = (err) => {
      reject(err);
    };
    
    // Set source to object URL of the file
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Create a blob URL from an image file
 * @param {File} file - The image file
 * @returns {string} - Object URL for the image
 */
export function createImageUrlFromFile(file) {
  return URL.createObjectURL(file);
}

/**
 * Optimize an SVG string for final output
 * @param {string} svgString - The SVG string to optimize
 * @returns {string} - Optimized SVG string
 */
export function optimizeSvg(svgString) {
  // Basic optimization - remove unnecessary attributes and whitespace
  return svgString
    .replace(/\s+/g, ' ') // Replace multiple whitespaces with a single space
    .replace(/>\s+</g, '><') // Remove whitespace between tags
    .replace(/\s+>/g, '>') // Remove whitespace before closing brackets
    .replace(/<\s+/g, '<') // Remove whitespace after opening brackets
    .trim();
}