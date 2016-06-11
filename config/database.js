/**
 *  Default database configuration file
 *
 *  Created by trinte-creator script
 *  App based on TrinteJS MVC framework
 *  TrinteJS homepage http://www.trintejs.com
 *
 *  docs: https://github.com/biggora/caminte/wiki/Connecting-to-DB#connecting
 **/

module.exports.production = {
    driver     : 'sqlite3',
    // host       : '127.0.0.1',
    // port       : '3306',
    // username   : 'test',
    // password   : 'test',
    database   : './db/main.sqlite',
    autoReconnect : true
};

module.exports.development = {
    driver     : 'sqlite3',
    // host       : '127.0.0.1',
    // port       : '3306',
    // username   : 'test',
    // password   : 'test',
    database   : './db/main.sqlite',
    autoReconnect : true
};

module.exports.test = {
    driver     : 'sqlite3',
    // host       : '127.0.0.1',
    // port       : '3306',
    // username   : 'test',
    // password   : 'test',
    database   : './db/main.sqlite',
    autoReconnect : true
};

module.exports.dev = module.exports.development;