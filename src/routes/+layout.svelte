<script>
  import '../app.css';
  import Navbar from '$lib/components/Navbar.svelte';
</script>

<div class="min-h-screen flex flex-col">
  <div class="container mx-auto px-4">
    <Navbar />
  </div>
  
  <main class="flex-grow">
    <slot></slot>
  </main>
  
  <footer class="footer footer-center p-4 bg-base-200 text-base-content">
    <div class="flex flex-col sm:flex-row items-center gap-2 text-xs opacity-70">
      <span>© 2025 img2svg</span>
      <span class="hidden sm:inline">•</span>
      <span>Transform raster images to SVG with ease</span>
    </div>
  </footer>
</div>