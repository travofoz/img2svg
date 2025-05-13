# DaisyUI Integration with Tailwind 4

## Key Requirements

To ensure DaisyUI works correctly with Tailwind 4, the following configuration is required:

1. **Critical CSS syntax**: 
   ```css
   @import 'tailwindcss';
   @plugin "daisyui";
   ```
   
   This is the new syntax required for Tailwind 4 (not the old `@tailwind` directives).

2. **No custom theme configuration in CSS**:
   - Remove custom theme configurations from app.css
   - DaisyUI themes are controlled through the HTML data-theme attribute

3. **Package versions**:
   - tailwindcss: 4.x
   - daisyui: 5.x
   - @tailwindcss/vite: 4.x

## Common Mistakes to Avoid

1. Using old Tailwind 3 directives (`@tailwind base`, etc.)
2. Creating tailwind.config.js for customization too early
3. Modifying the vite.config.js with unnecessary plugins

## Dependency Order

Make sure tailwindcss loads before daisyui in the CSS file.

## Testing DaisyUI Integration

To verify DaisyUI is working, add a simple component like:

```html
<div class="alert alert-info">
  <span>DaisyUI is working!</span>
</div>
```