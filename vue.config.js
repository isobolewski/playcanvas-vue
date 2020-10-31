// vue.config.js
module.exports = {
    // options...
    configureWebpack: {
        devServer: {
            compress: true, // Use GZip compression
            mimeTypes: {},
            // open: 'Google Chrome' // Start Google Chrome after npm run serve
        }
    }
}