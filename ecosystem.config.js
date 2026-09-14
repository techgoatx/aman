module.exports = {
  apps: [{
    name: 'AMAN-MD',
    script: 'index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 20664
    },
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    log_file: './logs/aman.log',
    merge_logs: true,
    time: true
  }]
};