<script>
  import ImageUpload from '$lib/components/ImageUpload.svelte';
  import TraceControls from '$lib/components/TraceControls.svelte';
  import SvgPreview from '$lib/components/SvgPreview.svelte';
  import { 
    traceImage, 
    createImageDataFromFile, 
    createImageUrlFromFile,
    optimizeSvg
  } from '$lib/services/imageTracerService.js';
  import {
    checkBrowserCompatibility,
    getCompatibilityWarnings,
    hasMinimumCompatibility
  } from '$lib/services/browserCompatibility.js';
  import { onMount } from 'svelte';
  
  // Application state
  let uploadedFile = null;
  let originalImageUrl = '';
  let imageData = null;
  let traceOptions = {
    preset: 'default',
    ltres: 1,
    qtres: 1,
    pathomit: 8,
    colorsampling: 2,
    numberofcolors: 16,
    mincolorratio: 0.02,
    colorquantcycles: 3,
    blurradius: 0,
    blurdelta: 20,
    scale: 1,
    roundcoords: 1,
    linefilter: false,
    strokewidth: 1
  };
  let svgString = '';
  let svgStats = {
    width: 0,
    height: 0,
    paths: 0,
    nodes: 0,
    size: '0KB'
  };
  let isTracing = false;
  let showOriginal = false;
  
  // Browser compatibility
  let compatibilityChecked = false;
  let compatibilityWarnings = [];
  let isCompatible = true;
  
  onMount(() => {
    // Check browser compatibility
    const compatibility = checkBrowserCompatibility();
    compatibilityWarnings = getCompatibilityWarnings(compatibility);
    isCompatible = hasMinimumCompatibility();
    compatibilityChecked = true;
  });
  
  // Handle file upload
  async function handleFilesChange(event) {
    const { files } = event.detail;
    
    if (files && files.length > 0) {
      // Use only the first file
      uploadedFile = files[0];
      
      // Create URL for preview
      originalImageUrl = createImageUrlFromFile(uploadedFile);
      
      try {
        // Convert file to image data
        imageData = await createImageDataFromFile(uploadedFile);
        
        // Auto-trace if we have image data
        if (imageData) {
          processTrace();
        }
      } catch (error) {
        console.error('Error processing image:', error);
        alert('Failed to process the image. Please try another file.');
      }
    } else {
      // Reset if no files
      uploadedFile = null;
      originalImageUrl = '';
      imageData = null;
      svgString = '';
    }
  }
  
  // Handle trace options change
  function handleOptionsChange(event) {
    traceOptions = event.detail.options;
    
    // Re-trace with new options if we have an image
    if (imageData) {
      processTrace();
    }
  }
  
  // Process the image tracing
  async function processTrace() {
    if (!imageData) return;
    
    isTracing = true;
    
    try {
      // Trace the image
      const result = await traceImage(imageData, traceOptions);
      
      // Optimize SVG for final output
      svgString = optimizeSvg(result.svgString);
      svgStats = result.stats;
      
      isTracing = false;
    } catch (error) {
      console.error('Error during tracing:', error);
      alert('Failed to trace the image. Please try different settings or another image.');
      isTracing = false;
    }
  }
  
  // Dismiss compatibility warning
  function dismissWarning(index) {
    compatibilityWarnings = compatibilityWarnings.filter((_, i) => i !== index);
  }
</script>

<div class="container mx-auto p-4">
  <header class="text-center mb-8">
    <h1 class="text-4xl font-bold mb-2">PNG to SVG Converter</h1>
    <p class="text-base-content/70">Upload an image and convert it to a vector SVG using intelligent tracing</p>
  </header>
  
  <!-- Compatibility warnings -->
  {#if compatibilityChecked && compatibilityWarnings.length > 0}
    <div class="mb-4">
      {#each compatibilityWarnings as warning, i}
        <div class="alert alert-warning mb-2 flex justify-between items-center">
          <span>{warning}</span>
          <button class="btn btn-sm btn-circle" on:click={() => dismissWarning(i)}>✕</button>
        </div>
      {/each}
    </div>
  {/if}
  
  {#if !compatibilityChecked || isCompatible}
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- Left column: Image upload and configuration -->
      <div class="lg:col-span-1 space-y-4">
        <!-- Image upload component -->
        <ImageUpload 
          multiple={false} 
          accept="image/png,image/jpeg"
          on:filesChange={handleFilesChange}
        />
        
        <!-- Trace configuration -->
        {#if imageData}
          <TraceControls 
            options={traceOptions}
            on:optionsChange={handleOptionsChange}
          />
        {/if}
      </div>
      
      <!-- Right column: Preview and output -->
      <div class="lg:col-span-2">
        {#if isTracing}
          <div class="w-full h-64 flex flex-col items-center justify-center">
            <span class="loading loading-spinner loading-lg text-primary"></span>
            <p class="mt-4">Tracing image...</p>
          </div>
        {:else}
          <SvgPreview
            {svgString}
            {originalImageUrl}
            {showOriginal}
            {svgStats}
            bind:showOriginal
          />
        {/if}
      </div>
    </div>
  {:else}
    <!-- Compatibility error -->
    <div class="card bg-error text-error-content p-6 text-center">
      <h2 class="text-2xl font-bold mb-4">Browser Not Compatible</h2>
      <p>Your browser does not support the required features for this application to function properly.</p>
      <p class="mt-4">Please try a modern browser like Chrome, Firefox, or Edge.</p>
    </div>
  {/if}
  
  <!-- Footer -->
  <footer class="mt-8 text-center text-sm text-base-content/70">
    <p>PNG to SVG Converter - Convert raster images to scalable vector graphics</p>
  </footer>
</div>