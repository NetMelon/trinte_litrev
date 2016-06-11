/**
 *  Project schema
 *
 *  @package     litrev
 *  @version     0.0.1
 *  @desc        litrev
 *  @author      netmelon
 *  @created     2016-06-11T16:21:19.533Z
 *  @link        https://github.com/biggora/caminte/wiki
 *
 *  Created by create-model script
 *  App based on TrinteJS MVC framework
 *  TrinteJS homepage http://www.trintejs.com
 **/

/**
 *  Define  Project Model
 *  @param  {Object}    schema
 *  @return {Object}
 *
 *  @link   https://github.com/biggora/caminte/wiki/Defining-a-Model
 **/
module.exports = function(schema){
    var Project = schema.define('project', {
         id : { type: Number },
         projectname : { type: String },
         description : { type: String },
         uid : { type: Number },
         createdat : { type: String },
         updatedat : { type: String }
    });
    return Project;
};