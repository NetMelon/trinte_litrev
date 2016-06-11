/**
 *  Projects Controller Test
 *  Created by create-test script @2016-06-11T16:21:19.572Z
 **/


var request = require('supertest');
var assert = require('assert');
var should = require('should');
var trinte = require('../../app');
var id, app, server, csrf, project;

describe('Controller Projects:', function () {

    this.timeout(5000);

    before(function (cb) {
        app = trinte.boot(3000);
        app.listen(3000, '127.0.0.1');
        server = request.agent(app);
        setTimeout(function () {
           getCSRF(server, function (csrf_val) {
                csrf = csrf_val;
                cb();
           });
        }, 500);
    });

    after(function (done) {
        done();
    });

    describe('GET   /projects (#index)', function () {

        it('respond with html', function (done) {
            server
                .get('/projects')
                .set('Accept', 'text/html')
                .expect('Content-Type', /html/)
                .expect(200, done);
        });

        it('respond with json', function (done) {
            server
                .get('/projects.json')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200, done);
        });

        it('respond with xml', function (done) {
            server
                .get('/projects.xml')
                .expect('Content-Type', /xml/)
                .expect(200, done);
        });

    });

    describe('GET   /projects/new (#new)', function () {

        it('respond with html', function (done) {
            server
                .get('/projects/new')
                .set('Accept', 'text/html')
                .expect(200)
                .expect('Content-Type', /html/)
                .end(function (err, res) {
                    if (err) { return done(err); }
                    done();
                });
        });

        it('respond with json', function (done) {
            server
                .get('/projects/new.json')
                .set('Accept', 'application/json')
                .expect(200)
                .expect('Content-Type', /json/)
                .end(function (err, res) {
                    if (err) { return done(err); }
                    user = res.body;
                    done();
                });
        });

        it('respond with xml', function (done) {
            server
                .get('/projects/new.xml')
                .set('Accept', 'text/xml')
                .expect(200)
                .expect('Content-Type', /xml/)
                .end(function (err, res) {
                    if (err) { return done(err); }
                    done();
                });
        });

    });

    describe('POST  /projects (#create)', function () {

        it('respond with html', function (done) {
            server
                .post('/projects')
                .send({
                    user: {name: 'admin'},
                    _csrf: csrf
                })
                .set('Accept', 'text/html')
                .expect(302)
                .end(function (err, res) {
                    if (err) { return done(err); }
                    done();
                });
        });

        it('respond with json', function (done) {
            server
                .post('/projects.json')
                .send({
                    user: {name: 'admin-json'},
                    _csrf: csrf
                })
                .set('Accept', 'application/json')
                .expect(201)
                .end(function (err, res) {
                    if (err) { return done(err); }
                    user = res.body;
                    done();
                });
        });

        it('respond with xml', function (done) {
            server
                .post('/projects.xml')
                .send({
                    user: {name: 'admin-xml'},
                    _csrf: csrf
                })
                .set('Accept', 'text/xml')
                .expect(201)
                .end(function (err, res) {
                    if (err) { return done(err); }
                    done();
                });
        });
    });

     describe('GET   /projects/:id (#show)', function () {

        it('respond with html', function (done) {
            server
                .get('/projects/' + user.id)
                .set('Accept', 'text/html')
                .expect(200)
                .end(function (err, res) {
                    if (err) { return done(err); }
                    done();
                });
        });

        it('respond with json', function (done) {
            server
                .get('/projects/' + user.id + '.json')
                .set('Accept', 'application/json')
                .expect(200)
                .end(function (err, res) {
                    if (err) { return done(err); }
                    done();
                });
        });

        it('respond with xml', function (done) {
            server
                .get('/projects/' + user.id + '.xml')
                .set('Accept', 'text/xml')
                .expect(200)
                .end(function (err, res) {
                    if (err) { return done(err); }
                    done();
                });
        });

     });

     describe('GET   /projects/edit/:id (#edit)', function () {

        it('respond with html', function (done) {
            server
                .get('/projects/edit/' + user.id)
                .set('Accept', 'text/html')
                .expect(200)
                .end(function (err, res) {
                    if (err) { return done(err); }
                    done();
                });
        });

        it('respond with json', function (done) {
            server
                .get('/projects/edit/' + user.id + '.json')
                .set('Accept', 'application/json')
                .expect(200)
                .end(function (err, res) {
                    if (err) { return done(err); }
                    done();
                });
        });

        it('respond with xml', function (done) {
            server
                .get('/projects/edit/' + user.id + '.xml')
                .set('Accept', 'text/xml')
                .expect(200)
                .end(function (err, res) {
                    if (err) { return done(err); }
                    done();
                });
        });
        
     });
     
/*
     describe('#update', function () {

     });
 */
 
     describe('DEL   /projects/:id (#destroy)', function () {

        it('respond with jsonp', function (done) {
            server
               .delete('/projects/' + user.id)
               .set('Accept', 'application/json')
               .send({
                   _csrf: csrf
                })
               .expect(200)
               .end(function (err, res) {
                    if (err) { return done(err); }
                    done();
               });
        });

     });

     describe('DEL   /projects (#destroyall)', function () {

        it('respond with jsonp', function (done) {
            server
                .delete('/projects')
                .set('Accept', 'application/json')
                .send({
                   _csrf: csrf
                 })
                .expect(200)
                .end(function (err, res) {
                    if (err) { return done(err); }
                    done();
                });
        });

     });

});