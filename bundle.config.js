// bundle.config.js 
module.exports = {
    bundle: {
        main: {
            scripts: [
                './src/js/main.js'
            ],
            styles: [
                './src/css/**/*.css'
            ]
        },
        vendor: {
            scripts: [
                './node_modules/hmh/index.js',
                './node_modules/angular-ui-mask/dist/mask.min.js',
                './src/js/semantic.min.js',
                './src/js/dropdown.js',
                './src/js/modal.min.js',
                './src/js/popup.min.js',
                './src/js/transition.min.js',
            ]
        }
    },
    copy: './src/themes/**/*'
};