'use strict';

const prayer = require('../prayer-db/prayer');
const AWS = require('aws-sdk');

module.exports.submit = (event, context, callback) => {
    //TODO: biz logic
    prayer.create(event, context, callback);
};

module.exports.get = (event, context, callback) => {
    //TODO: biz logic
    prayer.get(event, context, callback);
};

module.exports.delete = (event, context, callback) => {
    //TODO: biz logic
    prayer.delete(event, context, callback);
};

module.exports.list = (event, context, callback) => {
    //TODO: biz logic
    prayer.list(event, context, callback);
};

module.exports.update = (event, context, callback) => {
    //TODO: biz logic
    prayer.update(event, context, callback);
};


