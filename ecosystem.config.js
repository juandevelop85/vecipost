module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps: [
    // First application
    // Api
    {
      name: 'post',
      script: './src/server.js',
      error_file: 'err.log',
      out_file: 'out.log',
      log_file: 'combined.log',
      watch: false,
      ignore_watch: ['node_modules', 'client/img', '.git', '*.log', '*.pdf', '*.png', '*.jpg', '*.jpeg'],
      watch_options: {
        followSymlinks: false,
      },
    },
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy: {
    production: {
      //user : 'node',
      //host : '212.83.163.1',
      //ref  : 'origin/master',
      //repo : 'git@bitbucket.org:finnduti/finndu_service.git',
      //path : '/var/www/finndu_service',
      'post-deploy': 'npm install',
    },
    dev: {
      user: 'node',
      host: '212.83.163.1',
      ref: 'origin/master',
      repo: 'git@bitbucket.org:finnduti/finndu_service.git',
      path: '/var/www/development',
      'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env dev',
      env: {
        NODE_ENV: 'dev',
      },
    },
  },
};
