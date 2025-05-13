<script>
  // Props
  export let multiple = false;
  export let accept = "image/*";
  
  // State variables
  let isDragging = false;
  let files = [];
  let previewUrls = [];
  
  // Event dispatcher to emit events to parent components
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  
  // File input reference
  let fileInput;
  
  // Handle files received from any method (drag, paste, file input)
  function handleFiles(newFiles) {
    if (!newFiles || newFiles.length === 0) return;
    
    // Convert FileList to array
    const fileArray = Array.from(newFiles);
    
    // If not multiple, replace existing files
    if (!multiple) {
      // Revoke any existing object URLs to prevent memory leaks
      previewUrls.forEach(url => URL.revokeObjectURL(url));
      files = [];
      previewUrls = [];
    }
    
    // Add new files
    fileArray.forEach(file => {
      // Only accept images
      if (file.type.startsWith('image/')) {
        files = [...files, file];
        previewUrls = [...previewUrls, URL.createObjectURL(file)];
      }
    });
    
    // Dispatch the files to the parent component
    dispatch('filesChange', { files });
  }
  
  // Trigger file input when the dropzone is clicked
  function openFileDialog() {
    fileInput.click();
  }
  
  // Handle drag events
  function handleDragEnter(e) {
    e.preventDefault();
    e.stopPropagation();
    isDragging = true;
  }
  
  function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
    isDragging = true;
  }
  
  function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    isDragging = false;
  }
  
  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    isDragging = false;
    
    const dt = e.dataTransfer;
    if (dt?.files) {
      handleFiles(dt.files);
    }
  }
  
  // Handle file input change
  function handleInputChange(e) {
    const target = e.target;
    handleFiles(target.files);
  }
  
  // Handle clipboard paste events
  function handlePaste(e) {
    const items = e.clipboardData?.items;
    
    if (!items) return;
    
    const imageFiles = Array.from(items)
      .filter(item => item.type.startsWith('image/'))
      .map(item => item.getAsFile())
      .filter(file => file !== null);
    
    if (imageFiles.length > 0) {
      // Create a new DataTransfer object and add the image files
      const dataTransfer = new DataTransfer();
      imageFiles.forEach(file => dataTransfer.items.add(file));
      
      // Process the files
      handleFiles(dataTransfer.files);
    }
  }
  
  // Clean up object URLs when component is destroyed
  import { onDestroy } from 'svelte';
  onDestroy(() => {
    previewUrls.forEach(url => URL.revokeObjectURL(url));
  });
</script>

<!-- Handle paste events on the document -->
<svelte:window on:paste={handlePaste} />

<!-- Dropzone container with DaisyUI styling -->
<div 
  class="dropzone card bg-base-200 p-4 border-2 border-dashed {isDragging ? 'border-primary bg-base-300' : 'border-base-300'}"
  on:click={openFileDialog}
  on:dragenter={handleDragEnter}
  on:dragover={handleDragOver}
  on:dragleave={handleDragLeave}
  on:drop={handleDrop}
>
  <!-- Hidden file input -->
  <input
    bind:this={fileInput}
    type="file"
    {accept}
    {multiple}
    class="hidden"
    on:change={handleInputChange}
  />
  
  <!-- Show preview images if there are any, otherwise show the default content -->
  {#if previewUrls.length > 0}
    <div class="grid grid-cols-1 gap-4 w-full">
      {#each previewUrls as url, i}
        <div class="relative group">
          <img src={url} alt="Preview" class="w-full h-auto object-contain rounded-md" />
          <button 
            class="btn btn-circle btn-sm btn-error absolute top-2 right-2 opacity-0 group-hover:opacity-100"
            on:click|stopPropagation={() => {
              URL.revokeObjectURL(url);
              files = files.filter((_, index) => index !== i);
              previewUrls = previewUrls.filter((_, index) => index !== i);
              dispatch('filesChange', { files });
            }}
          >
            ✕
          </button>
        </div>
      {/each}
    </div>
  {:else}
    <!-- Default content -->
    <div class="text-center p-6">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mx-auto mb-2 text-base-content" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
      <h3 class="text-lg font-semibold mb-1">Upload Images</h3>
      <p class="text-sm text-base-content/70 mb-3">
        Drag & drop PNG/JPG here, paste from clipboard, or click to browse
      </p>
      <div class="badge badge-outline">PNG</div>
      <div class="badge badge-outline">JPG</div>
    </div>
  {/if}
  
  <!-- Slot for custom content -->
  <slot {isDragging}></slot>
</div>

<style>
  .dropzone {
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .dropzone:hover {
    background-color: hsl(var(--b2));
  }
</style>