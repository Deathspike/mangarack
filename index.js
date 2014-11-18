module.exports = require.main === module ?
    require('./src/cli') :
    require('./src/server');
