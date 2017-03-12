'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');

module.exports.submit = (event, context, callback) => {
    // create a response
    const response = {
        statusCode: 200,
        body: JSON.stringify("Calling request.submit"),
    };
    callback(null, response);
};
