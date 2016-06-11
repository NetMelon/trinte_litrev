/**
 *  Default App Controller
 *
 *  @package     litrev
 *  @version     
 *  @desc        litrev
 *  @author      netmellon
 *  @created     2016-06-11T12:10:38.887Z
 *  @link        https://github.com/biggora/trinte/wiki
 *
 *  Created by create-controller script
 *  App based on TrinteJS MVC framework
 *  TrinteJS homepage http://www.trintejs.com
 **/
var fs = require('fs');

module.exports = {
    /**
     * Default Application index - shows a list of the controllers.
     * Redirect here if you prefer another controller to be your index.
     * @param req
     * @param res
     * @param next
     */
    'index': function(req, res) {

        /**
         * If you want to redirect to another controller, uncomment
         */

        var controllers = [];

        fs.readdir(__dirname + '/', function(err, files) {
            if (err) {
                throw err;
            }
            files.forEach(function(file) {
                if(/\.js$/i.test(file)) {
                   if (file !== 'AppsController.js') {
                       controllers.push(file.replace('Controller.js', '').toLowerCase());
                   }
                }
            });
            res.render('app', {
                controllers: controllers
            });
        });
    },
    /**
     * Default Application login page.
     * @param req
     * @param res
     * @param next
     */
    'login': function(req, res) {
            res.render('login', {
                controllers: []
            });
    }
};