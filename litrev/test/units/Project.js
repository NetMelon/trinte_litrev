/**
 *  Projects Unit Test
 *  Created by create-test script @2016-06-11T16:21:19.571Z
 **/


var should = require('should');
var caminte = require('caminte');
var config = require('../../config/database');
var dbConf = config[process.env.NODE_ENV];
var ProjectModel = require('../../app/models/Project');
var Schema = caminte.Schema;
dbConf.host = process.env.DB_HOST || dbConf.host;
var schema = new Schema(dbConf.driver, dbConf);
var Project = ProjectModel(schema);

/**
 * Simple tests for the Banner model
 */
describe('Unit Project:', function () {
	'use strict';
	var project, id;

	before(function (done) {
		schema.autoupdate(function () {
			'use strict';
			done();
		});
	});

	after(function (done) {
		done();
	});

	describe('create unit', function () {

		project = new Project();
		it('project should be object', function () {
			project.should.be.type('object');
		});

		it('validate project', function (done) {
			project.isValid(function (valid) {
				valid.should.be.true;
				if (!valid) console.log(project.errors);
				done();
			});
		});

	});

	describe('#save()', function () {

		it('should be have #save', function () {
			project.should.be.have.property('save');
			project.save.should.be.type('function');
		});

		it('call save()', function (done) {
			project.save(function (err) {
				should.not.exist(err);
				project.should.be.have.property('id');
				project.id.should.not.eql(null);
				id = project.id;
				done();
			});
		});

	});

	describe('#destroy()', function () {

		it('should be have #destroy', function () {
			project.should.be.have.property('destroy');
			project.destroy.should.be.type('function');
		});

		it('call destroy()', function (done) {
			project.destroy(function (err) {
				should.not.exist(err);
				done();
			});
		});

	});

});