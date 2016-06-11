/**
 *  Routes manager
 *  Inject resource mapper reference
 *
 *  Created by trinte-creator script
 *  App based on TrinteJS MVC framework
 *  TrinteJS homepage http://www.trintejs.com
 *
 *  docs: https://github.com/biggora/trinte/wiki/Routes
 **/
/* jshint unused: false */
var Auth = require('./authorization/local');
var Mail = require('./addons/mailer');
var Uploader = require('./addons/uploader');
var Recaptcha = require('./addons/recaptcha');

/**
 * Define routes
 * @param {Object} map
 * @param {Object} app
 **/
module.exports = function routes(map, app) {
       map.resources('projects');
       map.resources('users');
       map.root('apps#index');
       map.get('/login','apps#login');
       map.post('/login', Auth.localAuth('/login', '/'));
       map.all('/logout', Auth.logOut( '/' ));
       map.post('/sendmail', Mail.mailSender());
       map.post('/uploading', Uploader.middleware());
        /**
        * recapcha usage Recaptcha.middleware()
        **/
};