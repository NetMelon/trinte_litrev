/**
*  Project Model Test
*  Created by create-test script @2016-06-11T16:21:19.575Z
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

describe('Model Project:', function () {
    'use strict';
    var id;

    before(function (done) {
        schema.autoupdate(function () {
            'use strict';
            done();
        });
    });

    describe('properties methods:', function () {

        it('#toString', function () {
            Project.should.be.have.property('toString');
            Project.toString.should.be.type('function');
        });

        it('#forEachProperty', function () {
            Project.should.be.have.property('forEachProperty');
            Project.forEachProperty.should.be.type('function');
        });

        it('#registerProperty', function () {
            Project.should.be.have.property('registerProperty');
            Project.registerProperty.should.be.type('function');
        });

    });

    describe('scope methods:', function () {

        it('#scope', function () {
            Project.should.be.have.property('scope');
            Project.scope.should.be.type('function');
        });

    });

    describe('query methods:', function () {

        it('#create', function () {
            Project.should.be.have.property('create');
            Project.create.should.be.type('function');
        });

        it('#exists', function () {
            Project.should.be.have.property('exists');
            Project.exists.should.be.type('function');
        });

        it('#count', function () {
            Project.should.be.have.property('count');
            Project.count.should.be.type('function');
        });

        it('#findOrCreate', function () {
            Project.should.be.have.property('findOrCreate');
            Project.findOrCreate.should.be.type('function');
        });

        it('#findById', function () {
            Project.should.be.have.property('findById');
            Project.findById.should.be.type('function');
        });

        it('#findOne', function () {
            Project.should.be.have.property('findOne');
            Project.findOne.should.be.type('function');
        });

        it('#find', function () {
            Project.should.be.have.property('find');
            Project.find.should.be.type('function');
        });

        it('#all', function () {
            Project.should.be.have.property('all');
            Project.all.should.be.type('function');
        });

        it('#run', function () {
            Project.should.be.have.property('run');
            Project.run.should.be.type('function');
        });

        it('#exec', function () {
            Project.should.be.have.property('exec');
            Project.exec.should.be.type('function');
        });

        it('#update', function () {
            Project.should.be.have.property('update');
            Project.update.should.be.type('function');
        });

        it('#updateOrCreate', function () {
            Project.should.be.have.property('updateOrCreate');
            Project.updateOrCreate.should.be.type('function');
        });

        it('#upsert', function () {
            Project.should.be.have.property('upsert');
            Project.upsert.should.be.type('function');
        });

        it('#destroyAll', function () {
            Project.should.be.have.property('destroyAll');
            Project.destroyAll.should.be.type('function');
        });

        it('#destroyById', function () {
            Project.should.be.have.property('destroyById');
            Project.destroyById.should.be.type('function');
        });

        it('#remove', function () {
            Project.should.be.have.property('remove');
            Project.remove.should.be.type('function');
        });

    });

    describe('relations methods:', function () {
        it('#hasMany', function () {
            Project.should.be.have.property('hasMany');
            Project.hasMany.should.be.type('function');
        });
        it('#belongsTo', function () {
            Project.should.be.have.property('belongsTo');
            Project.hasMany.should.be.type('function');
        });
    });

    describe('validations methods:', function () {

        it('#validate', function () {
            Project.should.be.have.property('validate');
            Project.validate.should.be.type('function');
        });

        it('#validatesPresenceOf', function () {
            Project.should.be.have.property('validatesPresenceOf');
            Project.validatesPresenceOf.should.be.type('function');
        });

        it('#validatesLengthOf', function () {
            Project.should.be.have.property('validatesLengthOf');
            Project.validatesLengthOf.should.be.type('function');
        });

        it('#validatesNumericalityOf', function () {
            Project.should.be.have.property('validatesNumericalityOf');
            Project.validatesNumericalityOf.should.be.type('function');
        });

        it('#validatesInclusionOf', function () {
            Project.should.be.have.property('validatesInclusionOf');
            Project.validatesInclusionOf.should.be.type('function');
        });

        it('#validatesInclusionOf', function () {
            Project.should.be.have.property('validatesInclusionOf');
            Project.validatesInclusionOf.should.be.type('function');
        });

        it('#validatesFormatOf', function () {
            Project.should.be.have.property('validatesFormatOf');
            Project.validatesFormatOf.should.be.type('function');
        });

        it('#validatesUniquenessOf', function () {
            Project.should.be.have.property('validatesUniquenessOf');
            Project.validatesUniquenessOf.should.be.type('function');
        });

        it('#validateAsync', function () {
            Project.should.be.have.property('validateAsync');
            Project.validateAsync.should.be.type('function');
        });

    });

    describe('hook methods:', function () {

        it('#afterInitialize', function () {
            Project.should.be.have.property('afterInitialize');
            // Project.afterInitialize.should.be.type('function');
        });

        it('#beforeValidation', function () {
            Project.should.be.have.property('beforeValidation');
            // Project.afterInitialize.should.be.type('function');
        });

        it('#afterValidation', function () {
            Project.should.be.have.property('afterValidation');
        });

        it('#beforeSave', function () {
            Project.should.be.have.property('beforeSave');
        });

        it('#afterSave', function () {
            Project.should.be.have.property('afterSave');
        });

        it('#beforeCreate', function () {
            Project.should.be.have.property('beforeCreate');
        });

        it('#afterCreate', function () {
            Project.should.be.have.property('afterCreate');
        });

        it('#beforeUpdate', function () {
            Project.should.be.have.property('beforeUpdate');
        });

        it('#afterUpdate', function () {
            Project.should.be.have.property('afterUpdate');
        });

        it('#beforeDestroy', function () {
            Project.should.be.have.property('beforeDestroy');
        });

        it('#afterDestroy', function () {
            Project.should.be.have.property('afterDestroy');
        });
    });

    describe('model:', function () {
        it('#create', function (done) {
            Project.create(function (err, created) {
                should.not.exist(err);
                created.should.be.have.property('id');
                created.id.should.not.eql(null);
                id = created.id;
                done();
            });
        });

        it('#exists', function (done) {
            Project.exists(id, function (err, exists) {
                should.not.exist(err);
                exists.should.be.true;
                done();
            });
        });

        it('#findById', function (done) {
            Project.findById(id, function (err, found) {
                should.not.exist(err);
                found.id.should.equal(id);
                done();
            });
        });

        it('#findOne', function (done) {
            Project.findOne({
                where: {
                    id: id
                }
            }, function (err, found) {
                should.not.exist(err);
                found.id.should.equal(id);
                done();
            });
        });

        it('#find', function (done) {
            Project.find({}, function (err, founds) {
                should.not.exist(err);
                founds.should.length(1);
                done();
            });
        });

        it('#all', function (done) {
            Project.all({}, function (err, founds) {
                should.not.exist(err);
                founds.should.length(1);
                done();
            });
        });

        it('#count', function (done) {
            Project.count({}, function (err, count) {
                should.not.exist(err);
                count.should.equal(1);
                done();
            });
        });

        it('#destroyById', function (done) {
            Project.destroyById(id, function (err) {
                should.not.exist(err);
                Project.findById(id, function (err, found) {
                    should.not.exist(err);
                    should.not.exist(found);
                    done();
                });
            });
        });

    });
});