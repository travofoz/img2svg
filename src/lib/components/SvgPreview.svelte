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
      await navigator.clipboard.writeText(svgString);
      alert('SVG copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy SVG:', err);
      alert('Failed to copy SVG to clipboard');
    }
  }
</script>

<div class="flex flex-col h-full">
  <div class="flex justify-between items-center mb-2">
    <!-- Preview title -->
    <div>
      {#if originalImageUrl && svgString}
        <span class="text-sm font-medium">Slide to compare original and SVG</span>
      {:else if originalImageUrl}
        <span class="text-sm font-medium">Original Image</span>
      {:else if svgString}
        <span class="text-sm font-medium">SVG Result</span>
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
      <div class="w-full h-full overflow-hidden flex items-center justify-center">
        <!-- DaisyUI diff component -->
        <div class="diff aspect-auto h-full w-full max-w-full max-h-full rounded-lg">
          <div class="diff-item-1 flex items-center justify-center">
            <img 
              src={originalImageUrl} 
              alt="Original image" 
              class="max-h-[350px] object-contain"
              style="transform: scale({scale});"
            />
          </div>
          <div class="diff-item-2 flex items-center justify-center bg-white">
            <div style="transform: scale({scale}); transition: transform 0.2s; max-height: 350px; display: flex; align-items: center; justify-content: center;">
              {@html svgString}
            </div>
          </div>
          <div class="diff-resizer"></div>
        </div>
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
        <div style="transform: scale({scale}); transition: transform 0.2s; max-height: 350px;">
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
    max-width: 100%;
    max-height: 350px;
    width: auto;
    height: auto;
  }
  
  /* Make sure diff slider is visible */
  :global(.diff-resizer) {
    width: 4px;
    background-color: theme('colors.primary');
    opacity: 0.8;
  }
  
  /* Make background white for SVG visibility */
  :global(.diff-item-2) {
    background: white;
  }
</style>