/**
 *  Users Controller
 *
 *  @package     litrev
 *  @version     0.0.1
 *  @desc        litrev
 *  @author      netmelon
 *  @created     2016-06-11T16:20:58.309Z
 *  @link        https://github.com/biggora/trinte/wiki
 *
 *  Created by create-controller script
 *  App based on TrinteJS MVC framework
 *  TrinteJS homepage http://www.trintejs.com
 **/

/*global
  pathTo, User
*/
var pager = require('../lib/pager.js');
var Tools = require('../lib/tools.js');
var ViewTemplatePath = 'users';

module.exports = {

    /**
     * Index action, returns a list either via the views/users/index.ejs view or via json
     * Default mapping to GET '/users'
     * For JSON use '/users.json'
     * View Helper method pathTo.users()
     * For paging use  pathTo.paging_users(from, to)
     * @param {Object} req
     * @param {Object} res
     * @param {Function} next
     **/
    'index': function(req, res, next) {
        var t = res.locals.t;
        var title = t('users.title.index','Users');
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

        Tools.validateFields(User, query, {}, function(err, filtered) {
            for (var field in filtered) {
                if (filtered[field] !== '') {
                    opts.where[field] = filtered[field];
                }
            }
            opts.where = Tools.queryToDb(User, opts.where);
            User.count({ where : opts.where }, function(err, count) {
                total = count;
                var pagerHtml = pager.render(from, to, total, pathTo.users(), query);
                User.all(opts, function (err, users) {
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
                            out.items = users.map(function(u) {
                                return u.toObject();
                            });
                            res.json(out);
                            break;
                        case 'xml':
                            out.items = users.map(function(u) {
                                return { item : u.toObject() };
                            });
                            res.xml({ root : out });
                            break;
                        default:
                            out.users = users;
                            out.pagerHtml = pagerHtml;
                            res.render(ViewTemplatePath + '/index', out);
                    }
                });
            });
        });
    },

    /**
     * New action, returns a form via views/users/edit.ejs view no JSON view.
     * Default mapping to GET '/user/new'
     * View Helper method pathTo.new_user()
     * @param {Object} req
     * @param {Object} res
     * @param {Function} next
     **/
    'new': function(req, res) {
        var t = res.locals.t;
        var title = t('users.title.new','New User');
        var format = req.params.format || '';
        var user = new User(req.query);
        switch (format.toString()) {
            case 'json':
                res.json(user.toObject());
                break;
            case 'xml':
                res.xml({ root : { item : user.toObject() } });
                break;
            default:
                res.render(ViewTemplatePath + '/new',{
                    user : user,
                    title : title
                });
        }
    },

    /**
     * Create action, creates a single item and redirects to Show or returns the object as json
     * Default mapping to POST '/users', no GET mapping
     * View Helper method pathTo.create_user()
     * @param {Object} req
     * @param {Object} res
     * @param {Function} next
     **/
    'create': function(req, res){
        var format = req.params.format || '';
        var action = req.body._action || 'save';
        Tools.validateFields(User, req.body.user, {
            validate: true
        }, function(err, filtered) {
            if (err && err.length) {
                req.flash('error','Could not create user: ' + err.join(', \n'));
                res.redirect(pathTo.new_user(req.body.user));
                return;
            }
            var user = new User(filtered);
            user.save(function(err) {
                if (err) {
                    req.flash('error','Could not create user: ' + err);
                    res.redirect(pathTo.new_user(user));
                    return;
                }
                switch (format.toString()) {
                    case 'json':
                        res.status(201);
                        res.json(user.toObject());
                        break;
                    case 'xml':
                        res.xml(201, { root : { user : user.toObject() } });
                        break;
                    default:
                        switch(action) {
                           case 'new':
                                 req.flash('info','User created and new');
                                 res.redirect(pathTo.new_user());
                              break;
                           case 'copy':
                                 req.flash('info','User created and copy');
                                 delete user.id;
                                 res.redirect(pathTo.new_user(user.toObject()));
                              break;
                           case 'apply':
                                 req.flash('success','User saved');
                                 res.redirect(pathTo.edit_user(user.toObject()));
                              break;
                           default:
                              req.flash('success','User created');
                              res.redirect(pathTo.show_user(user.toObject()));
                        }
                }
            });
       });
    },

    /**
     * Show action, returns shows a single item via views/users/show.ejs view or via json
     * Default mapping to GET '/user/:id'
     * For JSON use '/user/:id.json'
     * View Helper method pathTo.show_user(instance)
     * @param {Object} req
     * @param {Object} res
     * @param {Function} next
     **/
    'show': function(req, res, next) {
        var t = res.locals.t;
        var title = t('users.title.show','Show User');
        var format = req.params.format || '';
        User.findById(req.params.id, function(err, user) {
            if(err) {
               return next(err);
            }
            if(user) {
               switch (format.toString()) {
                    case 'json':
                        res.json(user.toObject());
                        break;
                    case 'xml':
                        res.xml({ root : { user : user.toObject() } });
                        break;
                    default:
                        res.render(ViewTemplatePath + '/show',{
                             user:user,
                             title : title
                        });
               }
            } else {
               req.flash('warning', 'user Not Found.');
               res.redirect(pathTo.users());
            }
        });
    },

    /**
     * Edit action, returns a form via views/users/edit.ejs view no JSON view.
     * Default mapping to GET '/user/:id/edit'
     * View Helper method pathTo.edit_user(instance)
     * @param {Object} req
     * @param {Object} res
     * @param {Function} next
     **/
    'edit': function(req, res, next) {
        var t = res.locals.t;
        var title = t('users.title.show','Edit User');
        var format = req.params.format || '';
        User.findById(req.params.id, function(err, user) {
            if(err) {
                return next(err);
            }
            if(user) {
                if(req.query) {
                   for( var key in req.query) {
                      user[key] = req.query[key];
                   }
                }
                switch (format.toString()) {
                    case 'json':
                        res.json(user.toObject());
                        break;
                    case 'xml':
                        res.xml({ root : { user : user.toObject() } });
                        break;
                    default:
                        res.render(ViewTemplatePath + '/edit',{
                            user : user,
                            title : title
                        });
                }
            } else {
                    req.flash('warning','user Not Found.');
                    res.redirect(pathTo.users());
            }
        });
    },

    /**
     * Update action, updates a single item and redirects to Show or returns the object as json
     * Default mapping to PUT '/user/:id', no GET mapping
     * View Helper method pathTo.update_user(id)
     * @param {Object} req
     * @param {Object} res
     * @param {Function} next
     **/
    'update': function(req, res) {
        var format = req.params.format || '';
        var action = req.body._action || 'save';
        User.findById(req.params.id, function(err, user) {
            Tools.validateFields(User, req.body.user, {
                validate: true
            }, function(err, filtered) {
                if (err && err.length) {
                    req.flash('error','Could not update user: ' + err.join(', \n'));
                    res.redirect(pathTo.edit_user(user, req.body.user));
                    return;
                }
                user.updateAttributes(filtered, function(err) {
                    if (err) {
                        console.log(err);
                        req.flash('error','Could not update user: ' + err);
                        res.redirect(pathTo.edit_user(user));
                        return;
                    }
                    switch (format.toString()) {
                        case 'json':
                              res.json(user.toObject());
                           break;
                        case 'xml':
                              res.xml({ root : { user : user.toObject() } });
                           break;
                        default:
                           switch(action) {
                              case 'new':
                                    req.flash('info','User updated and new');
                                    res.redirect(pathTo.new_user());
                                 break;
                              case 'copy':
                                    req.flash('info','User updated and copy');
                                    delete user.id;
                                    res.redirect(pathTo.new_user(user.toObject()));
                                 break;
                              case 'apply':
                                    req.flash('success','User saved');
                                    res.redirect(pathTo.edit_user(user.toObject()));
                                 break;
                              default:
                                    req.flash('success','User updated');
                                    res.redirect(pathTo.show_user(user.toObject()));
                           }
                   }
               });
            });
        });
    },

    /**
     * Delete action, deletes a single item and redirects to index
     * Default mapping to DEL '/user/:id', no GET mapping
     * View Helper method pathTo.destroy_user(instance)
     * @param {Object} req
     * @param {Object} res
     * @param {Function} next
     **/
    'destroy': function(req, res){
         var returnTo = (req.session || {} ).returnTo || pathTo.users();
         User.findById(req.params.id, function(err, user) {
                if (!user) {
                    req.flash('error','Unable to locate the user to delete!');
                    res.send('false');
                    return false;
                }
                user.destroy(function(err) {
                   if(err) {
                       req.flash('error','There was an error deleting the user!');
                       res.send('"' + returnTo + '"');
                   } else {
                       req.flash('success','User deleted');
                       res.send('"' + returnTo + '"');
                   }
               });
        });
    },

    /**
     * Delete action, deletes a all items and redirects to index
     * Default mapping to DEL '/users', no GET mapping
     * View Helper method pathTo.destroy_users()
     * @param {Object} req
     * @param {Object} res
     * @param {Function} next
     **/
    'destroyall': function(req, res){
        var returnTo = (req.session || {} ).returnTo || pathTo.users();
        User.destroyAll(function(err) {
            if(err) {
                req.flash('error','There was an error deleting the users!');
                res.send('"' + returnTo + '"');
            } else {
                req.flash('success','Users deleted');
                res.send('"' + returnTo + '"');
            }
        });
    }
};