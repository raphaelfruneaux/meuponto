// bundle.config.js
module.exports = {
  bundle: {
    main: {
      scripts: [
        './src/js/**/*.module.js',
        './src/js/index.*.js',
        './src/js/controllers/*.js',
        './src/js/directives/*.js',
        './src/js/filters/*.js',
        './src/js/services/*.js',
      ],
      styles: [
        './src/css/**/*.css'
      ]
    },
    vendor: {
      scripts: [
        './node_modules/hmh/index.js',
        './node_modules/angular-ui-mask/dist/mask.min.js',
        './node_modules/angular-ui-router/release/angular-ui-router.js',
        './src/js/vendors/*.js',
      ]
    }
  },
  copy: './src/themes/**/*'
};
