<script>
  // Props
  export let svgString = '';
  export let originalImageUrl = '';
  export let showOriginal = false;
  export let imageFormat = '';
  export let svgStats = {
    width: 0,
    height: 0,
    paths: 0,
    nodes: 0,
    size: '0KB'
  };
  
  // Toggle between original and traced image
  function togglePreview() {
    showOriginal = !showOriginal;
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

<div class="card bg-base-200 p-4">
  <div class="flex justify-between items-center mb-3">
    <h2 class="text-lg font-semibold">SVG Preview</h2>
    
    <div class="join">
      <button 
        class="join-item btn btn-sm {!showOriginal ? 'btn-primary' : 'btn-outline'}"
        on:click={togglePreview}
        disabled={!svgString}
      >
        Traced
      </button>
      <button 
        class="join-item btn btn-sm {showOriginal ? 'btn-primary' : 'btn-outline'}"
        on:click={togglePreview}
        disabled={!originalImageUrl}
      >
        Original
      </button>
    </div>
  </div>
  
  <!-- Preview area -->
  <div class="preview-container bg-base-300 rounded-md overflow-hidden flex items-center justify-center" style="height: 300px;">
    {#if showOriginal && originalImageUrl}
      <img 
        src={originalImageUrl} 
        alt="Original image" 
        class="max-w-full max-h-full object-contain"
      />
    {:else if svgString}
      <div class="w-full h-full flex items-center justify-center">
        {@html svgString}
      </div>
    {:else}
      <div class="text-center p-6 text-base-content/50">
        <p>SVG will appear here after tracing</p>
      </div>
    {/if}
  </div>
  
  <!-- SVG stats -->
  {#if svgString}
    <div class="stats stats-vertical md:stats-horizontal shadow w-full mt-3">
      <div class="stat">
        <div class="stat-title">Size</div>
        <div class="stat-value text-lg">{svgStats.size}</div>
      </div>
      
      <div class="stat">
        <div class="stat-title">Dimensions</div>
        <div class="stat-value text-lg">{svgStats.width}×{svgStats.height}</div>
      </div>
      
      <div class="stat">
        <div class="stat-title">Paths</div>
        <div class="stat-value text-lg">{svgStats.paths}</div>
      </div>
      
      <div class="stat">
        <div class="stat-title">Nodes</div>
        <div class="stat-value text-lg">{svgStats.nodes}</div>
      </div>
      
      {#if imageFormat}
        <div class="stat">
          <div class="stat-title">Source</div>
          <div class="stat-value text-lg">{imageFormat}</div>
        </div>
      {/if}
    </div>
  {/if}
  
  <!-- Download / Copy buttons -->
  <div class="mt-3 flex gap-2">
    <button 
      class="btn btn-sm btn-primary"
      on:click={downloadSvg}
      disabled={!svgString}
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      Download SVG
    </button>
    
    <button 
      class="btn btn-sm btn-outline"
      on:click={copySvgToClipboard}
      disabled={!svgString}
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
      </svg>
      Copy SVG
    </button>
  </div>
</div>

<style>
  :global(svg) {
    max-width: 100%;
    max-height: 100%;
  }
</style>