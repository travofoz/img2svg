module.exports = {
  apps: [
    {
      name: 'img2svg',
      script: 'node_modules/vite/bin/vite.js',
      args: 'preview --host --port 3150',
      env: {
        NODE_ENV: 'production'
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G'
    }
  ]
};