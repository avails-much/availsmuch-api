'use strict';

const prayerDB = require('../prayer/prayer-db');

module.exports.router = (event, context, callback) => {

    console.log("*********************** event: " + JSON.stringify(event));
    
    const collectionHandlers = {
        "GET": list,
        "POST": submit
    }

    const itemHandlers = {
        "DELETE": remove,
        "GET": get
    }

    let handlers = (event["pathParameters"] == null) ? collectionHandlers : itemHandlers;
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


function submit(event, context, callback) {
    const request = JSON.parse(event.body);

    if (typeof request.description !== 'string') {
        console.error('Validation Failed'); // eslint-disable-line no-console
        callback(new Error('Couldn\'t create the prayer. Request must be a string.'));
        return;
    } else {
        prayerDB.create(request).then(
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
};

function get(event, context, callback) {
    prayerDB.get(event.pathParameters.id).then(
        success => {
            const response = {
                statusCode: 200,
                body: JSON.stringify(success.prayer),
            };
            callback(null, response);
        },
        failure => callback(new Error(result.failed))
    );
};

function remove(event, context, callback) {
    prayerDB.delete(event.pathParameters.id).then(
        success => {
            const response = {
                statusCode: 200,
                body: JSON.stringify(success),
            };
            callback(null, response);
        },
        failure => callback(new Error(failure.failed))
    );
};

function list(event, context, callback) {
    prayerDB.list().then(
        success => {
            const response = {
                statusCode: 200,
                body: JSON.stringify(success.prayers),
            };
            callback(null, response);
        },
        failure => callback(new Error(result.failed))
    );
};
