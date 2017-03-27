'use strict';

const groupDB = require('../group/group-db');

module.exports.router = (event, context, callback) => {

    console.log("*********************** group router  event: " + JSON.stringify(event));

    const handlers = {
        "POST": create
    }

    let httpMethod = event["httpMethod"];

    if (httpMethod in handlers) {
        return handlers[httpMethod](event, context, callback);
    } else {
        console.error('*************** http method not found');
        const response = {
            statusCode: 405,
            body: JSON.stringify({
                message: `Invalid HTTP Method: ${httpMethod}`
            }),
        };

        callback(null, response);
    }
};

modules.exports.create = (event, context, callback) => {
    const request = JSON.parse(event.body);

    groupDB.create(request).then(
        success => {
            const response = {
                statusCode: 200,
                body: JSON.stringify(success),
            };
            callback(null, response);
        },
        failure => callback(new Error(result.failed))
    );
}