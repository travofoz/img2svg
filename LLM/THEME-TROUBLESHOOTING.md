# Theme Troubleshooting Guide

## Critical DaisyUI + Tailwind 4 Configuration

To ensure the theme switcher and DaisyUI work correctly:

1. **Required CSS Configuration**:
   ```css
   @import 'tailwindcss';
   @plugin '@tailwindcss/forms';
   @plugin "daisyui" {
     themes: retro --default, luxury --prefersdark;
   }
   ```

2. **Required Dependencies**:
   - tailwindcss: 4.x
   - daisyui: 5.x
   - @tailwindcss/vite: 4.x
   - @tailwindcss/forms: 0.5.x

3. **Vite Configuration**:
   ```js
   import tailwindcss from '@tailwindcss/vite';
   import { sveltekit } from '@sveltejs/kit/vite';
   import { defineConfig } from 'vite';

   export default defineConfig({
     plugins: [tailwindcss(), sveltekit()]
   });
   ```

4. **DO NOT** create a tailwind.config.js file - it will break DaisyUI integration.

5. **DO NOT** use postcss.config.js - it's not needed and conflicts with Tailwind 4 + DaisyUI.

## Common Mistakes That Break Theming

1. Missing @tailwindcss/forms plugin in app.css
2. Creating tailwind.config.js
3. Using postcss.config.js
4. Using old Tailwind 3 directives (@tailwind base, etc.)
5. Missing :global() styles for swap component

## Theme Switcher Requirements

The ThemeSwitch.svelte component requires global styles to work with DaisyUI:

```css
:global(.swap) {
  position: relative;
  display: inline-grid;
  user-select: none;
  place-content: center;
}

:global(.swap-on),
:global(.swap-off) {
  grid-area: 1/1;
  transition-duration: 0.3s;
  transition-timing-function: ease-in-out;
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
```

## NEVER MODIFY THESE FILES WITHOUT TESTING

1. Do not remove the `@plugin '@tailwindcss/forms'` line from app.css
2. Do not modify the vite.config.js plugin order
3. Do not reintroduce postcss.config.js or tailwind.config.js