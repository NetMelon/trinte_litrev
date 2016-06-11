/**
 *  User schema
 *
 *  @package     litrev
 *  @version     0.0.1
 *  @desc        litrev
 *  @author      netmellon
 *  @created     2016-06-11T12:23:27.027Z
 *  @link        https://github.com/biggora/caminte/wiki
 *
 *  Created by create-model script
 *  App based on TrinteJS MVC framework
 *  TrinteJS homepage http://www.trintejs.com
 **/

/**
 *  Define  User Model
 *  @param  {Object}    schema
 *  @return {Object}
 *
 *  @link   https://github.com/biggora/caminte/wiki/Defining-a-Model
 **/
module.exports = function(schema){
    var User = schema.define('user', {
         id : { type: Number },
         username : { type: String },
         password : { type: String },
         salt : { type: String },
         email : { type: String },
         createdat : { type: String },
         updatedat : { type: String }
    });
    return User;
};