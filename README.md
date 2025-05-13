# Image to SVG Converter

A web application that converts raster images (PNG/JPG) to SVG vector graphics using intelligent tracing algorithms.

## Features

- **Upload images** via drag and drop or clipboard paste
- **Adjust tracing settings** with real-time preview
- **Download results** as optimized SVG files
- **Compare original** and traced versions
- **Configure trace parameters** with predefined presets

## Technology Stack

- **Frontend Framework**: SvelteKit
- **UI Components**: DaisyUI/Tailwind CSS
- **Tracing Engine**: ImageTracerJS
- **Build System**: Vite

## Getting Started

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/png2svg.git
   cd png2svg
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Visit `http://localhost:5173` in your browser

### Building for Production

```bash
npm run build
```

## Usage

1. **Upload an image**: Drag and drop a PNG or JPG file, paste from clipboard, or click to browse
2. **Adjust settings**: Use the preset buttons or fine-tune individual parameters
3. **View the result**: Switch between original and traced views using the toggle
4. **Download SVG**: Click the "Download SVG" button to save the vector graphic

## Configuration Options

- **Preset Styles**: Choose from predefined styles like Default, Posterized, Curvy, etc.
- **Detail Level**: Adjust the level of detail in the tracing
- **Color Count**: Control the number of colors in the output
- **Path Simplification**: Reduce complexity of paths
- **Curve Smoothness**: Adjust the smoothness of curves
- **Edge Detection**: Enable edge detection for sharper outlines

## Browser Compatibility

The application should work in all modern browsers. For the clipboard paste functionality, the browser must support the Clipboard API.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [ImageTracerJS](https://github.com/jankovicsandras/imagetracerjs) for the core tracing functionality
- [Potrace](https://github.com/kilobtye/potrace) for the fallback tracing engine
- [SvelteKit](https://kit.svelte.dev/) for the app framework
- [DaisyUI](https://daisyui.com/) for the UI components