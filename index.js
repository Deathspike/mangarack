module.exports = require.main === module ?
    require('./lib/cli') :
    require('./lib/server');
