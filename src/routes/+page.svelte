<script>
  import SvgPreview from '$lib/components/SvgPreview.svelte';
  import { 
    traceImage, 
    createImageDataFromFile, 
    createImageUrlFromFile,
    optimizeSvg
  } from '$lib/services/imageTracerService.js';
  
  // Basic state
  let uploadedFile = $state(null);
  let originalImageUrl = $state('');
  let imageData = $state(null);
  let svgString = $state('');
  let isTracing = $state(false);
  let traceOptions = $state({
    preset: 'default',
    ltres: 1,
    qtres: 1,
    pathomit: 8,
    colorsampling: 2,
    numberofcolors: 16
  });
  
  // Handle file upload
  async function handleFileChange(event) {
    const files = event.target.files;
    
    if (files && files.length > 0) {
      uploadedFile = files[0];
      originalImageUrl = createImageUrlFromFile(uploadedFile);
      
      try {
        imageData = await createImageDataFromFile(uploadedFile);
        
        if (imageData) {
          isTracing = true;
          const result = await traceImage(imageData, traceOptions);
          svgString = optimizeSvg(result.svgString);
          isTracing = false;
        }
      } catch (error) {
        console.error('Error processing image:', error);
        alert('Failed to process the image. Please try another file.');
        isTracing = false;
      }
    }
  }
  
  // Handle preset selection
  function selectPreset(preset) {
    traceOptions.preset = preset;
    
    if (imageData) {
      processTrace();
    }
  }
  
  // Process the image tracing
  async function processTrace() {
    if (!imageData) return;
    
    isTracing = true;
    
    try {
      const result = await traceImage(imageData, traceOptions);
      svgString = optimizeSvg(result.svgString);
      isTracing = false;
    } catch (error) {
      console.error('Error during tracing:', error);
      alert('Failed to trace the image. Please try different settings or another image.');
      isTracing = false;
    }
  }
</script>

<div class="container mx-auto px-4 py-8 max-w-4xl">
  
  <!-- Header -->
  <div class="text-center mb-8">
    <h1 class="text-3xl font-bold mb-2">Image to SVG Converter</h1>
    <p class="text-base-content/70">Convert your images to scalable vector graphics</p>
  </div>
  
  <!-- Main Content -->
  <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
    <!-- Left Panel -->
    <div class="md:col-span-5">
      <!-- Upload Card -->
      <div class="card bg-base-200 shadow-lg mb-6">
        <div class="card-body">
          <h2 class="card-title text-lg">Upload Image</h2>
          <div class="form-control">
            <label class="label">
              <span class="label-text">Select an image file</span>
            </label>
            <input 
              type="file" 
              class="file-input file-input-bordered file-input-primary w-full" 
              accept="image/png,image/jpeg,image/webp,image/gif,image/bmp"
              onchange={handleFileChange}
            />
            <label class="label">
              <span class="label-text-alt">Supported: PNG, JPG, WebP, GIF, BMP</span>
            </label>
          </div>
        </div>
      </div>
      
      <!-- Settings Card -->
      {#if imageData}
        <div class="card bg-base-200 shadow-lg">
          <div class="card-body">
            <h2 class="card-title text-lg">Trace Settings</h2>
            
            <!-- Presets -->
            <div class="mb-4">
              <label class="label"><span class="label-text">Select a preset</span></label>
              <div class="join w-full">
                <button class="btn btn-sm join-item flex-1 {traceOptions.preset === 'default' ? 'btn-primary' : ''}" onclick={() => selectPreset('default')}>Default</button>
                <button class="btn btn-sm join-item flex-1 {traceOptions.preset === 'posterized2' ? 'btn-primary' : ''}" onclick={() => selectPreset('posterized2')}>Poster</button>
                <button class="btn btn-sm join-item flex-1 {traceOptions.preset === 'curvy' ? 'btn-primary' : ''}" onclick={() => selectPreset('curvy')}>Curvy</button>
              </div>
              <div class="join w-full mt-2">
                <button class="btn btn-sm join-item flex-1 {traceOptions.preset === 'sharp' ? 'btn-primary' : ''}" onclick={() => selectPreset('sharp')}>Sharp</button>
                <button class="btn btn-sm join-item flex-1 {traceOptions.preset === 'detailed' ? 'btn-primary' : ''}" onclick={() => selectPreset('detailed')}>Detailed</button>
                <button class="btn btn-sm join-item flex-1 {traceOptions.preset === 'smoothed' ? 'btn-primary' : ''}" onclick={() => selectPreset('smoothed')}>Smooth</button>
              </div>
            </div>
            
            <!-- Colors Control -->
            <div class="form-control">
              <label class="label">
                <span class="label-text">Number of colors</span>
                <span class="label-text-alt">{traceOptions.numberofcolors}</span>
              </label>
              <input 
                type="range" 
                min="2" 
                max="64" 
                value={traceOptions.numberofcolors}
                onchange={(e) => {
                  traceOptions.numberofcolors = parseInt(e.target.value);
                  traceOptions.preset = 'custom';
                  processTrace();
                }}
                class="range range-xs range-primary" 
              />
            </div>
          </div>
        </div>
      {/if}
    </div>
    
    <!-- Right Panel -->
    <div class="md:col-span-7">
      <!-- Processing Indicator -->
      {#if isTracing}
        <div class="card bg-base-200 shadow-lg">
          <div class="card-body items-center text-center py-12">
            <div class="loading loading-spinner loading-lg text-primary"></div>
            <p class="mt-4">Converting image to SVG...</p>
          </div>
        </div>
      
      <!-- Original Image Preview -->
      {:else if originalImageUrl && !svgString}
        <div class="card bg-base-200 shadow-lg">
          <div class="card-body">
            <h2 class="card-title text-lg">Original Image</h2>
            <div class="bg-base-300 rounded-box p-4 flex justify-center">
              <img 
                src={originalImageUrl} 
                alt="Original" 
                class="max-w-full max-h-[400px] object-contain" 
              />
            </div>
          </div>
        </div>
      
      <!-- SVG Result -->
      {:else if svgString}
        <div class="card bg-base-200 shadow-lg">
          <div class="card-body">
            <SvgPreview 
              {svgString} 
              originalImageUrl={createImageUrlFromFile(uploadedFile)}
              svgStats={{ 
                width: imageData?.width || 0, 
                height: imageData?.height || 0,
                paths: svgString.match(/<path/g)?.length || 0,
                nodes: svgString.match(/<(circle|rect|ellipse|line|polygon|polyline)/g)?.length || 0,
                size: `${Math.round(svgString.length / 1024)}KB`
              }}
            />
          </div>
        </div>
      
      <!-- Empty State -->
      {:else}
        <div class="card bg-base-200 shadow-lg">
          <div class="card-body items-center text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-base-content/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 class="mt-4 text-lg font-medium">No Image Selected</h3>
            <p class="mt-2 text-sm opacity-70">Upload an image to convert it to SVG</p>
          </div>
        </div>
      {/if}
    </div>
  </div>
  
  
  <!-- Footer -->
  <div class="mt-4 text-center text-xs opacity-50">
    <p>Convert raster images to SVG using intelligent tracing algorithms</p>
  </div>
</div>