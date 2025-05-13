<script>
  // Default trace options with explanations
  export let options = {
    // Preset selection
    preset: 'default',
    
    // Line threshold - smaller values produce more detailed traces
    ltres: 1,
    
    // Quadratic threshold - smaller values produce more detailed traces
    qtres: 1,
    
    // Path omit threshold - eliminates paths shorter than this
    pathomit: 8,
    
    // Color sampling method (1: random sampling, 2: deterministic sampling)
    colorsampling: 2,
    
    // Number of colors to use in trace
    numberofcolors: 16,
    
    // Minimum color ratio
    mincolorratio: 0.02,
    
    // Color quantization cycles
    colorquantcycles: 3,
    
    // Edge detection mode (false = off, true = on)
    blurradius: 0,
    
    // Blur radius if edge detection is on
    blurdelta: 20,
    
    // Scale the SVG output
    scale: 1,
    
    // Edge node type (1: linear, 2: quadratic, 3: cubic)
    roundcoords: 1,
    
    // Line threshold for edge node type
    linefilter: false,
    
    // Minimum segments for line filtering
    strokewidth: 1
  };
  
  // Available presets
  const presets = [
    { id: 'default', name: 'Default' },
    { id: 'posterized1', name: 'Posterized (1)' },
    { id: 'posterized2', name: 'Posterized (2)' },
    { id: 'posterized3', name: 'Posterized (3)' },
    { id: 'curvy', name: 'Curvy' },
    { id: 'sharp', name: 'Sharp' },
    { id: 'detailed', name: 'Detailed' },
    { id: 'smoothed', name: 'Smoothed' },
    { id: 'grayscale', name: 'Grayscale' }
  ];
  
  // Event dispatcher to emit changes
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();
  
  // Apply preset to current options
  function applyPreset(presetId) {
    options.preset = presetId;
    dispatch('optionsChange', { options });
  }
  
  // Handle changes to individual parameters
  function handleParameterChange() {
    options.preset = 'custom';
    dispatch('optionsChange', { options });
  }
</script>

<div class="card bg-base-200 p-4">
  <h2 class="text-lg font-semibold mb-3">Trace Configuration</h2>
  
  <!-- Preset selection -->
  <div class="form-control mb-4">
    <label class="label">
      <span class="label-text">Preset Style</span>
    </label>
    <div class="grid grid-cols-3 gap-2">
      {#each presets as preset}
        <button 
          class="btn btn-sm {options.preset === preset.id ? 'btn-primary' : 'btn-outline'}"
          on:click={() => applyPreset(preset.id)}
        >
          {preset.name}
        </button>
      {/each}
    </div>
  </div>
  
  <!-- Divider -->
  <div class="divider text-xs text-opacity-70">Advanced Settings</div>
  
  <!-- Advanced parameters -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <!-- Color settings -->
    <div class="form-control">
      <label class="label">
        <span class="label-text">Color count</span>
      </label>
      <input
        type="range"
        min="2"
        max="64"
        step="1"
        bind:value={options.numberofcolors}
        on:change={handleParameterChange}
        class="range range-primary range-sm"
      />
      <div class="label">
        <span class="label-text-alt">{options.numberofcolors} colors</span>
      </div>
    </div>
    
    <!-- Detail level -->
    <div class="form-control">
      <label class="label">
        <span class="label-text">Detail level</span>
      </label>
      <input
        type="range"
        min="0.1"
        max="5"
        step="0.1"
        bind:value={options.ltres}
        on:change={handleParameterChange}
        class="range range-primary range-sm"
      />
      <div class="label">
        <span class="label-text-alt">Lower = more details</span>
      </div>
    </div>
    
    <!-- Path simplification -->
    <div class="form-control">
      <label class="label">
        <span class="label-text">Path simplification</span>
      </label>
      <input
        type="range"
        min="0"
        max="20"
        step="1"
        bind:value={options.pathomit}
        on:change={handleParameterChange}
        class="range range-primary range-sm"
      />
      <div class="label">
        <span class="label-text-alt">Higher = simpler paths</span>
      </div>
    </div>
    
    <!-- Curve smoothness -->
    <div class="form-control">
      <label class="label">
        <span class="label-text">Curve smoothness</span>
      </label>
      <input
        type="range"
        min="0.1"
        max="5"
        step="0.1"
        bind:value={options.qtres}
        on:change={handleParameterChange}
        class="range range-primary range-sm"
      />
      <div class="label">
        <span class="label-text-alt">Lower = smoother curves</span>
      </div>
    </div>
    
    <!-- SVG Scale -->
    <div class="form-control">
      <label class="label">
        <span class="label-text">Output scale</span>
      </label>
      <input
        type="range"
        min="0.1"
        max="10"
        step="0.1"
        bind:value={options.scale}
        on:change={handleParameterChange}
        class="range range-primary range-sm"
      />
      <div class="label">
        <span class="label-text-alt">{options.scale}x</span>
      </div>
    </div>
    
    <!-- Edge detection -->
    <div class="form-control">
      <label class="label cursor-pointer justify-start gap-2">
        <input
          type="checkbox"
          bind:checked={options.blurradius}
          on:change={handleParameterChange}
          class="checkbox checkbox-primary checkbox-sm"
        />
        <span class="label-text">Edge detection</span>
      </label>
      
      {#if options.blurradius}
        <input
          type="range"
          min="0"
          max="5"
          step="0.1"
          bind:value={options.blurradius}
          on:change={handleParameterChange}
          class="range range-primary range-xs mt-2"
        />
        <div class="label">
          <span class="label-text-alt">Edge detection strength</span>
        </div>
      {/if}
    </div>
  </div>
  
  <!-- Reset button -->
  <div class="mt-4">
    <button 
      class="btn btn-sm btn-outline"
      on:click={() => applyPreset('default')}
    >
      Reset to default
    </button>
  </div>
</div>