const path = require('path');
const contentBase = path.resolve();

module.exports = {
    productionSourceMap: false,

    configureWebpack: config => {
        config.optimization = {
            minimize: false
        };

        config.devServer = {
            compress: true, // Use GZip compression
            before(app) {
                // use proper mime-type for wasm files
                app.get('*.wasm', function (req, res, next) {
                    const options = {
                        root: contentBase + '/public/',
                        dotfiles: 'deny',
                        headers: {
                            'Content-Type': 'application/wasm'
                        }
                    };
                    res.sendFile(req.url, options, function (err) {
                        if (err) { next(err); }
                    });
                });
            },

            // open: 'Google Chrome' // Start Google Chrome after npm run serve
        };
    }
}