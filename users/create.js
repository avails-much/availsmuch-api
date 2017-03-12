'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
  const timestamp = new Date().getTime();
  console.log("event body = " + event.body);
  const data = JSON.parse(event.body);
  var email = data.email;
  const queryParams = {
    TableName: process.env.USER_TABLE,
    IndexName: 'email-index',
    KeyConditionExpression: "email = :email",
    ExpressionAttributeValues: {
      ":email": email
    }
  }

  if (typeof data.email !== 'string' || typeof data.firstName != 'string' || typeof data.lastName != 'string') {
    console.error('Validation Failed'); // eslint-disable-line no-console
    callback(new Error('Couldn\'t create the user.'));
    return;    
  };

  // query the user table for the email address provided
  dynamoDb.query(queryParams, (error, result) => {
    // handle potential errors
    if (error) {
      console.error("Unable to query. Error:", JSON.stringify(error, null, 2));
    } else {
      console.log("Query succeeded.");
      console.log(result);
      console.log(result.Items);
      if (result.Items.length == 0) {
        console.log("No user with the email " + email + " exists yet, so create can continue.")
        
        const params = {
          TableName: process.env.USER_TABLE,
          Item: {
            id: uuid.v1(),
            email: email,
            firstName: data.firstName,
            lastName: data.lastName,
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
              callback(new Error('Couldn\'t create the user.'));
              return;
            }

            // create a response
            const response = {
              statusCode: 200,
              body: JSON.stringify(result.User),
            };
            callback(null, response);
        });
      } else {
        console.error("A user with that email address already exists. Preventing create.");
        callback(new Error('A user with that email address already exists.'));
        return;
      }
    }
  });
};
