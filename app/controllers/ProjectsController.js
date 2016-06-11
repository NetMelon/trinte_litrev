/**
 *  Projects Controller
 *
 *  @package     litrev
 *  @version     0.0.1
 *  @desc        litrev
 *  @author      netmellon
 *  @created     2016-06-11T12:24:31.459Z
 *  @link        https://github.com/biggora/trinte/wiki
 *
 *  Created by create-controller script
 *  App based on TrinteJS MVC framework
 *  TrinteJS homepage http://www.trintejs.com
 **/

/*global
  pathTo, Project
*/
var pager = require('../lib/pager.js');
var Tools = require('../lib/tools.js');
var ViewTemplatePath = 'projects';

module.exports = {

    /**
     * Index action, returns a list either via the views/projects/index.ejs view or via json
     * Default mapping to GET '/projects'
     * For JSON use '/projects.json'
     * View Helper method pathTo.projects()
     * For paging use  pathTo.paging_projects(from, to)
     * @param {Object} req
     * @param {Object} res
     * @param {Function} next
     **/
    'index': function(req, res, next) {
        var t = res.locals.t;
        var title = t('projects.title.index','Projects');
        var format = req.params.format || '';
        var sort = req.query.sort || req.body.sort;
        var search = req.query.search || req.body.search;
        var query = req.method === 'POST'? req.body : req.query;
        var from = req.params.from ? parseInt(req.params.from) - 1 : 0;
        var to = req.params.to ? parseInt(req.params.to) : 20;
        var total = 0;
        var opts = {
            skip : from,
            limit : to,
            order : 'id DESC',
            where : {}
        };

        if(sort && sort !== '') {
            var direction = 'ASC';
            if(sort.substr(0, 1) === '-') {
                direction = 'DESC';
                sort = sort.substr(1, sort.length);
            }
            opts.order = sort + ' ' + direction;
        }

        if (search && search !== '') {
            var fieldName = 'name';
            var queryCond = '';
            search = search.toString().replace(/^\s|\s$/, '');
            var queryData = search.split('|');
            if (queryData.length > 1) {
                fieldName = queryData[0];
                queryCond = queryData[1];
            } else {
                queryCond = search;
            }
            opts.where[fieldName] = {
                regex: queryCond
            }
        }

        if( req.session ) {
            req.session.returnTo = req.originalUrl || req.url;
        }

        Tools.validateFields(Project, query, {}, function(err, filtered) {
            for (var field in filtered) {
                if (filtered[field] !== '') {
                    opts.where[field] = filtered[field];
                }
            }
            opts.where = Tools.queryToDb(Project, opts.where);
            Project.count({ where : opts.where }, function(err, count) {
                total = count;
                var pagerHtml = pager.render(from, to, total, pathTo.projects(), query);
                Project.all(opts, function (err, projects) {
                    if (err) {
                        return next(err);
                    }
                    var out = {
                        title: title,
                        first_page: 1,
                        curent_page: (from/to) + 1,
                        total_pages: parseInt((total/to).toFixed()) + 1,
                        items_per_page: to,
                        items_total: total,
                        items_start: from,
                        items_end: from + to,
                        query: query
                    };

                    switch (format.toString()) {
                        case 'json':
                            out.items = projects.map(function(u) {
                                return u.toObject();
                            });
                            res.json(out);
                            break;
                        case 'xml':
                            out.items = projects.map(function(u) {
                                return { item : u.toObject() };
                            });
                            res.xml({ root : out });
                            break;
                        default:
                            out.projects = projects;
                            out.pagerHtml = pagerHtml;
                            res.render(ViewTemplatePath + '/index', out);
                    }
                });
            });
        });
    },

    /**
     * New action, returns a form via views/projects/edit.ejs view no JSON view.
     * Default mapping to GET '/project/new'
     * View Helper method pathTo.new_project()
     * @param {Object} req
     * @param {Object} res
     * @param {Function} next
     **/
    'new': function(req, res) {
        var t = res.locals.t;
        var title = t('projects.title.new','New Project');
        var format = req.params.format || '';
        var project = new Project(req.query);
        switch (format.toString()) {
            case 'json':
                res.json(project.toObject());
                break;
            case 'xml':
                res.xml({ root : { item : project.toObject() } });
                break;
            default:
                res.render(ViewTemplatePath + '/new',{
                    project : project,
                    title : title
                });
        }
    },

    /**
     * Create action, creates a single item and redirects to Show or returns the object as json
     * Default mapping to POST '/projects', no GET mapping
     * View Helper method pathTo.create_project()
     * @param {Object} req
     * @param {Object} res
     * @param {Function} next
     **/
    'create': function(req, res){
        var format = req.params.format || '';
        var action = req.body._action || 'save';
        Tools.validateFields(Project, req.body.project, {
            validate: true
        }, function(err, filtered) {
            if (err && err.length) {
                req.flash('error','Could not create project: ' + err.join(', \n'));
                res.redirect(pathTo.new_project(req.body.project));
                return;
            }
            var project = new Project(filtered);
            project.save(function(err) {
                if (err) {
                    req.flash('error','Could not create project: ' + err);
                    res.redirect(pathTo.new_project(project));
                    return;
                }
                switch (format.toString()) {
                    case 'json':
                        res.status(201);
                        res.json(project.toObject());
                        break;
                    case 'xml':
                        res.xml(201, { root : { project : project.toObject() } });
                        break;
                    default:
                        switch(action) {
                           case 'new':
                                 req.flash('info','Project created and new');
                                 res.redirect(pathTo.new_project());
                              break;
                           case 'copy':
                                 req.flash('info','Project created and copy');
                                 delete project.id;
                                 res.redirect(pathTo.new_project(project.toObject()));
                              break;
                           case 'apply':
                                 req.flash('success','Project saved');
                                 res.redirect(pathTo.edit_project(project.toObject()));
                              break;
                           default:
                              req.flash('success','Project created');
                              res.redirect(pathTo.show_project(project.toObject()));
                        }
                }
            });
       });
    },

    /**
     * Show action, returns shows a single item via views/projects/show.ejs view or via json
     * Default mapping to GET '/project/:id'
     * For JSON use '/project/:id.json'
     * View Helper method pathTo.show_project(instance)
     * @param {Object} req
     * @param {Object} res
     * @param {Function} next
     **/
    'show': function(req, res, next) {
        var t = res.locals.t;
        var title = t('projects.title.show','Show Project');
        var format = req.params.format || '';
        Project.findById(req.params.id, function(err, project) {
            if(err) {
               return next(err);
            }
            if(project) {
               switch (format.toString()) {
                    case 'json':
                        res.json(project.toObject());
                        break;
                    case 'xml':
                        res.xml({ root : { project : project.toObject() } });
                        break;
                    default:
                        res.render(ViewTemplatePath + '/show',{
                             project:project,
                             title : title
                        });
               }
            } else {
               req.flash('warning', 'project Not Found.');
               res.redirect(pathTo.projects());
            }
        });
    },

    /**
     * Edit action, returns a form via views/projects/edit.ejs view no JSON view.
     * Default mapping to GET '/project/:id/edit'
     * View Helper method pathTo.edit_project(instance)
     * @param {Object} req
     * @param {Object} res
     * @param {Function} next
     **/
    'edit': function(req, res, next) {
        var t = res.locals.t;
        var title = t('projects.title.show','Edit Project');
        var format = req.params.format || '';
        Project.findById(req.params.id, function(err, project) {
            if(err) {
                return next(err);
            }
            if(project) {
                if(req.query) {
                   for( var key in req.query) {
                      project[key] = req.query[key];
                   }
                }
                switch (format.toString()) {
                    case 'json':
                        res.json(project.toObject());
                        break;
                    case 'xml':
                        res.xml({ root : { project : project.toObject() } });
                        break;
                    default:
                        res.render(ViewTemplatePath + '/edit',{
                            project : project,
                            title : title
                        });
                }
            } else {
                    req.flash('warning','project Not Found.');
                    res.redirect(pathTo.projects());
            }
        });
    },

    /**
     * Update action, updates a single item and redirects to Show or returns the object as json
     * Default mapping to PUT '/project/:id', no GET mapping
     * View Helper method pathTo.update_project(id)
     * @param {Object} req
     * @param {Object} res
     * @param {Function} next
     **/
    'update': function(req, res) {
        var format = req.params.format || '';
        var action = req.body._action || 'save';
        Project.findById(req.params.id, function(err, project) {
            Tools.validateFields(Project, req.body.project, {
                validate: true
            }, function(err, filtered) {
                if (err && err.length) {
                    req.flash('error','Could not update project: ' + err.join(', \n'));
                    res.redirect(pathTo.edit_project(project, req.body.project));
                    return;
                }
                project.updateAttributes(filtered, function(err) {
                    if (err) {
                        console.log(err);
                        req.flash('error','Could not update project: ' + err);
                        res.redirect(pathTo.edit_project(project));
                        return;
                    }
                    switch (format.toString()) {
                        case 'json':
                              res.json(project.toObject());
                           break;
                        case 'xml':
                              res.xml({ root : { project : project.toObject() } });
                           break;
                        default:
                           switch(action) {
                              case 'new':
                                    req.flash('info','Project updated and new');
                                    res.redirect(pathTo.new_project());
                                 break;
                              case 'copy':
                                    req.flash('info','Project updated and copy');
                                    delete project.id;
                                    res.redirect(pathTo.new_project(project.toObject()));
                                 break;
                              case 'apply':
                                    req.flash('success','Project saved');
                                    res.redirect(pathTo.edit_project(project.toObject()));
                                 break;
                              default:
                                    req.flash('success','Project updated');
                                    res.redirect(pathTo.show_project(project.toObject()));
                           }
                   }
               });
            });
        });
    },

    /**
     * Delete action, deletes a single item and redirects to index
     * Default mapping to DEL '/project/:id', no GET mapping
     * View Helper method pathTo.destroy_project(instance)
     * @param {Object} req
     * @param {Object} res
     * @param {Function} next
     **/
    'destroy': function(req, res){
         var returnTo = (req.session || {} ).returnTo || pathTo.projects();
         Project.findById(req.params.id, function(err, project) {
                if (!project) {
                    req.flash('error','Unable to locate the project to delete!');
                    res.send('false');
                    return false;
                }
                project.destroy(function(err) {
                   if(err) {
                       req.flash('error','There was an error deleting the project!');
                       res.send('"' + returnTo + '"');
                   } else {
                       req.flash('success','Project deleted');
                       res.send('"' + returnTo + '"');
                   }
               });
        });
    },

    /**
     * Delete action, deletes a all items and redirects to index
     * Default mapping to DEL '/projects', no GET mapping
     * View Helper method pathTo.destroy_projects()
     * @param {Object} req
     * @param {Object} res
     * @param {Function} next
     **/
    'destroyall': function(req, res){
        var returnTo = (req.session || {} ).returnTo || pathTo.projects();
        Project.destroyAll(function(err) {
            if(err) {
                req.flash('error','There was an error deleting the projects!');
                res.send('"' + returnTo + '"');
            } else {
                req.flash('success','Projects deleted');
                res.send('"' + returnTo + '"');
            }
        });
    }
};