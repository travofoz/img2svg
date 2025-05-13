<script>
  // Props
  let { 
    svgString = '',
    originalImageUrl = '',
    showOriginal = false,
    imageFormat = '',
    svgStats = {
      width: 0,
      height: 0,
      paths: 0,
      nodes: 0,
      size: '0KB'
    }
  } = $props();
  
  // State variables
  let scale = $state(1);
  
  // Toggle between original and traced image
  function togglePreview() {
    showOriginal = !showOriginal;
    dispatchEvent(new CustomEvent('update:showOriginal', { detail: { showOriginal } }));
  }
  
  // Zoom controls
  function zoomIn() {
    scale = Math.min(3, scale + 0.2);
  }
  
  function zoomOut() {
    scale = Math.max(0.5, scale - 0.2);
  }
  
  function resetZoom() {
    scale = 1;
  }
  
  // Download SVG file
  function downloadSvg() {
    if (!svgString) return;
    
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `traced-image-${Date.now()}.svg`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);
  }
  
  // Copy SVG to clipboard
  async function copySvgToClipboard() {
    if (!svgString) return;
    
    try {
      // Try using the Clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(svgString);
        showToast('SVG copied to clipboard!');
        return;
      }
      
      // Fallback method using text area
      const textArea = document.createElement('textarea');
      textArea.value = svgString;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (success) {
        showToast('SVG copied to clipboard!');
      } else {
        throw new Error('Failed to copy using execCommand');
      }
    } catch (err) {
      console.error('Failed to copy SVG:', err);
      showToast('Failed to copy SVG to clipboard', 'error');
    }
  }
  
  // Toast notification function
  function showToast(message, type = 'success') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast toast-${type} fixed bottom-4 right-4 z-50 p-4 rounded-box shadow-lg`;
    toast.style.backgroundColor = type === 'success' ? 'hsl(var(--su))' : 'hsl(var(--er))';
    toast.style.color = 'white';
    toast.innerText = message;
    
    // Add to DOM
    document.body.appendChild(toast);
    
    // Remove after a delay
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transition = 'opacity 0.5s ease';
      setTimeout(() => document.body.removeChild(toast), 500);
    }, 3000);
  }
</script>

<div class="flex flex-col h-full">
  <div class="flex justify-between items-center mb-2">
    <!-- Preview title -->
    <div>
      {#if originalImageUrl && svgString}
        <span class="text-sm font-medium">{showOriginal ? 'Original Image' : 'SVG Result'} ({svgStats.width}x{svgStats.height})</span>
      {:else if originalImageUrl}
        <span class="text-sm font-medium">Original Image</span>
      {:else if svgString}
        <span class="text-sm font-medium">SVG Result ({svgStats.width}x{svgStats.height})</span>
      {/if}
    </div>
    
    <!-- Zoom controls -->
    <div class="flex items-center gap-1">
      <button 
        class="btn btn-ghost btn-xs btn-circle"
        onclick={zoomOut}
        disabled={!svgString && !originalImageUrl}
        title="Zoom out"
        aria-label="Zoom out"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
        </svg>
      </button>
      
      <span class="text-xs w-10 text-center">{Math.round(scale * 100)}%</span>
      
      <button 
        class="btn btn-ghost btn-xs btn-circle"
        onclick={zoomIn}
        disabled={!svgString && !originalImageUrl}
        title="Zoom in"
        aria-label="Zoom in"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>
  </div>
  
  <!-- Preview area -->
  <div class="bg-base-200 rounded-md overflow-hidden flex items-center justify-center flex-grow min-h-[350px]">
    {#if originalImageUrl && svgString}
      <div class="w-full h-full flex items-center justify-center overflow-hidden">
        {#if showOriginal}
          <img 
            src={originalImageUrl} 
            alt="Original image" 
            class="max-h-[350px] object-contain transition-transform duration-200"
            style="transform: scale({scale});"
          />
        {:else}
          <div class="svg-container" style="transform: scale({scale}); transition: transform 0.2s; background: white; border-radius: 5px; width: {svgStats.width}px; height: {svgStats.height}px; display: flex; align-items: center; justify-content: center;">
            {@html svgString}
          </div>
        {/if}
        
        <!-- Toggle button -->
        <button 
          class="absolute top-2 right-2 btn btn-xs btn-circle"
          onclick={togglePreview}
          title={showOriginal ? "Show SVG" : "Show Original"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </button>
      </div>
    {:else if originalImageUrl}
      <div class="w-full h-full flex items-center justify-center overflow-hidden">
        <img 
          src={originalImageUrl} 
          alt="Original image" 
          class="max-h-[350px] object-contain transition-transform duration-200"
          style="transform: scale({scale});"
        />
      </div>
    {:else if svgString}
      <div class="w-full h-full flex items-center justify-center overflow-hidden">
        <div class="svg-container" style="transform: scale({scale}); transition: transform 0.2s; background: white; border-radius: 5px; width: {svgStats.width}px; height: {svgStats.height}px; display: flex; align-items: center; justify-content: center;">
          {@html svgString}
        </div>
      </div>
    {:else}
      <div class="text-center p-4 text-base-content/50 text-xs">
        <p>Upload an image to see the SVG preview</p>
      </div>
    {/if}
  </div>
  
  <!-- SVG stats -->
  {#if svgString}
    <div class="mt-2 grid grid-cols-5 gap-1 text-center">
      <div class="bg-base-200 rounded p-1">
        <div class="text-xs opacity-60">Size</div>
        <div class="text-xs font-medium">{svgStats.size}</div>
      </div>
      
      <div class="bg-base-200 rounded p-1">
        <div class="text-xs opacity-60">Width</div>
        <div class="text-xs font-medium">{svgStats.width}px</div>
      </div>
      
      <div class="bg-base-200 rounded p-1">
        <div class="text-xs opacity-60">Height</div>
        <div class="text-xs font-medium">{svgStats.height}px</div>
      </div>
      
      <div class="bg-base-200 rounded p-1">
        <div class="text-xs opacity-60">Paths</div>
        <div class="text-xs font-medium">{svgStats.paths}</div>
      </div>
      
      <div class="bg-base-200 rounded p-1">
        <div class="text-xs opacity-60">Nodes</div>
        <div class="text-xs font-medium">{svgStats.nodes}</div>
      </div>
    </div>
    
    <!-- Download buttons -->
    <div class="mt-2 flex gap-2 justify-end">
      <button 
        class="btn btn-xs btn-primary"
        onclick={downloadSvg}
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Download
      </button>
      
      <button 
        class="btn btn-xs btn-outline"
        onclick={copySvgToClipboard}
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
        </svg>
        Copy
      </button>
    </div>
  {/if}
</div>

<style>
  :global(svg) {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: contain;
  }
  
  .svg-container {
    max-width: 100%;
    max-height: 350px;
    overflow: visible;
  }
  
  @media (prefers-color-scheme: dark) {
    div[style*="background: white"] {
      background: #1a1a1a !important;
    }
  }
</style>