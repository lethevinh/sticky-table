var env = ENV = process.env.NODE_ENV = process.env.ENV = 'production';
if (env.NODE_ENV === "development") {
    module.exports = require('./src/config/webpack.dev.js');
}else{
    module.exports = require('./src/config/webpack.prod.js');
}
