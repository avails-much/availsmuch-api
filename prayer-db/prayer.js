'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
    const timestamp = new Date().getTime();
    console.log("event body = " + event.body);
    const data = JSON.parse(event.body);
    if (typeof data.description !== 'string') {
        console.error('Validation Failed'); // eslint-disable-line no-console
        callback(new Error('Couldn\'t create the prayer.'));
        return;
    };

    const params = {
        TableName: process.env.PRAYER_TABLE,
        Item: {
            id: uuid.v1(),
            description: data.description,
            owner: data.owner,
            prayedForCount: 0,
            answered: data.answered,
            created: timestamp,
            answeredDate: data.answeredDate
        }
    };

    console.error("params: " + JSON.stringify(params));
    // write the todo to the database
    dynamoDb.put(params, (error, result) => {
        // handle potential errors
        if (error) {

            console.error(error); // eslint-disable-line no-console
            callback(new Error('Couldn\'t create the prayer request.'));
            return;
        }

        // create a response
        const response = {
            statusCode: 200,
            body: JSON.stringify(result.Item),
        };
        callback(null, response);
    });
};

module.exports.delete = (event, context, callback) => {
    const params = {
        TableName: process.env.PRAYER_TABLE,
        Key: {
            id: event.pathParameters.id,
        },
    };

    // write the todo to the database
    dynamoDb.delete(params, (error) => {
        // handle potential errors
        if (error) {
            console.error(error); // eslint-disable-line no-console
            callback(new Error('Couldn\'t remove the prayer request.'));
            return;
        }

        // create a response
        const response = {
            statusCode: 200,
            body: JSON.stringify({}),
        };
        callback(null, response);
    });
};

module.exports.list = (event, context, callback) => {
    const params = {
        TableName: process.env.PRAYER_TABLE,
    };
    
    // fetch all todos from the database
    dynamoDb.scan(params, (error, result) => {
        // handle potential errors
        if (error) {
            console.error(error); // eslint-disable-line no-console
            callback(new Error('Couldn\'t fetch the todos.'));
            return;
        }

        // create a response
        const response = {
            statusCode: 200,
            body: JSON.stringify(result.Items),
        };
        callback(null, response);
    });
};

module.exports.get = (event, context, callback) => {
    const params = {
        TableName: process.env.PRAYER_TABLE,
        Key: {
            id: event.pathParameters.id,
        },
    };

    // fetch all todos from the database
    dynamoDb.get(params, (error, result) => {
        // handle potential errors
        if (error) {
            console.error(error); // eslint-disable-line no-console
            callback(new Error('Couldn\'t fetch the prayer request.'));
            return;
        }

        // create a response
        const response = {
            statusCode: 200,
            body: JSON.stringify(result.PrayerRequest),
        };
        callback(null, response);
    });
};

module.exports.update = (event, context, callback) => {
    const timestamp = new Date().getTime();
    const data = JSON.parse(event.body);

    // validation
    if (typeof data.text !== 'string' || typeof data.checked !== 'boolean') {
        console.error('Validation Failed'); // eslint-disable-line no-console
        callback(new Error('Couldn\'t update the prayer request.'));
        return;
    }

    const params = {
        TableName: process.env.PRAYER_TABLE,
        Key: {
            id: event.pathParameters.id,
        },
        ExpressionAttributeNames: {
            '#description': 'text',
        },
        ExpressionAttributeValues: {
            ':description': data.description,
            ':checked': data.checked,
            ':updatedAt': timestamp,
        },
        UpdateExpression: 'SET #todo_text = :text, checked = :checked, updatedAt = :updatedAt',
        ReturnValues: 'ALL_NEW'
    }

    // update the todo in the database
    dynamoDb.update(params, (error, result) => {
        // handle potential errors
        if (error) {
            console.error(error); // eslint-disable-line no-console
            callback(new Error('Couldn\'t update the prayer request.'));
            return;
        }

        // create a response
        const response = {
            statusCode: 200,
            body: JSON.stringify(result.Attributes),
        };
        callback(null, response);
    });
};
