'use strict';

const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.get = (event, context, callback) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
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
