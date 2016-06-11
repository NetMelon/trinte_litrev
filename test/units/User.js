/**
 *  Users Unit Test
 *  Created by create-test script @2016-06-11T12:23:27.074Z
 **/


var should = require('should');
var caminte = require('caminte');
var config = require('../../config/database');
var dbConf = config[process.env.NODE_ENV];
var UserModel = require('../../app/models/User');
var Schema = caminte.Schema;
dbConf.host = process.env.DB_HOST || dbConf.host;
var schema = new Schema(dbConf.driver, dbConf);
var User = UserModel(schema);

/**
 * Simple tests for the Banner model
 */
describe('Unit User:', function () {
	'use strict';
	var user, id;

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

		user = new User();
		it('user should be object', function () {
			user.should.be.type('object');
		});

		it('validate user', function (done) {
			user.isValid(function (valid) {
				valid.should.be.true;
				if (!valid) console.log(user.errors);
				done();
			});
		});

	});

	describe('#save()', function () {

		it('should be have #save', function () {
			user.should.be.have.property('save');
			user.save.should.be.type('function');
		});

		it('call save()', function (done) {
			user.save(function (err) {
				should.not.exist(err);
				user.should.be.have.property('id');
				user.id.should.not.eql(null);
				id = user.id;
				done();
			});
		});

	});

	describe('#destroy()', function () {

		it('should be have #destroy', function () {
			user.should.be.have.property('destroy');
			user.destroy.should.be.type('function');
		});

		it('call destroy()', function (done) {
			user.destroy(function (err) {
				should.not.exist(err);
				done();
			});
		});

	});

});