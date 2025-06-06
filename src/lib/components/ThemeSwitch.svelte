<script>
  import { onMount } from 'svelte';
  
  // Available themes
  const LIGHT_THEME = 'corporate';
  const DARK_THEME = 'luxury';
  
  // Current theme state - default to dark
  let theme = $state(DARK_THEME);
  let isDark = $state(true);
  
  // Event dispatcher
  const dispatch = (name, detail) => {
    dispatchEvent(new CustomEvent(name, { detail }));
  };
  
  // Initialize theme on mount
  onMount(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // Default to dark theme
      setTheme(DARK_THEME);
    }
  });
  
  // Set theme function
  function setTheme(newTheme) {
    theme = newTheme;
    isDark = newTheme === DARK_THEME;
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    dispatch('themeChange', { theme: newTheme });
  }
  
  // Toggle theme function
  function toggleTheme() {
    const newTheme = isDark ? LIGHT_THEME : DARK_THEME;
    setTheme(newTheme);
  }
</script>

<label class="swap swap-rotate bg-transparent border-none w-5 h-5">
  <!-- Hidden checkbox controls the state -->
  <input type="checkbox" checked={isDark} on:change={toggleTheme} class="opacity-0" />
  
  <!-- Sun icon -->
  <svg class="swap-off fill-current w-5 h-5 text-amber-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
  </svg>
  
  <!-- Moon icon -->
  <svg class="swap-on fill-current w-5 h-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
  </svg>
</label>

<style>
  /* Ensure the theme toggle is properly styled with DaisyUI */
  :global(.swap) {
    position: relative;
    display: inline-grid;
    user-select: none;
    place-content: center;
    width: 20px !important;
    height: 20px !important;
    max-width: 20px !important;
    max-height: 20px !important;
    overflow: hidden;
  }
  
  :global(.swap-on),
  :global(.swap-off) {
    grid-area: 1/1;
    transition-duration: 0.3s;
    transition-timing-function: ease-in-out;
    width: 20px !important;
    height: 20px !important;
  }
  
  :global(.swap input[type="checkbox"]:checked ~ .swap-on) {
    opacity: 1;
  }
  
  :global(.swap input[type="checkbox"]:checked ~ .swap-off) {
    opacity: 0;
  }
  
  :global(.swap-off) {
    opacity: 1;
  }
  
  :global(.swap-on) {
    opacity: 0;
  }
</style>