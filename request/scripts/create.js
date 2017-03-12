'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
  const timestamp = new Date().getTime();
  console.log("event body = " + event.body);
  const data = JSON.parse(event.body);
  if (typeof data.text !== 'string') {
    console.error('Validation Failed'); // eslint-disable-line no-console
    callback(new Error('Couldn\'t create the prayer.'));
    return;
  };
  
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      id: uuid.v1(),
      description: data.text,
      checked: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  };

   console.error("params: " +  JSON.stringify(params));
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