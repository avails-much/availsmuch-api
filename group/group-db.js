'use strict'

const uuid = require('uuid');
const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

export class groupDB {

    create(group) {
        return new Promise((resolve, reject) => {
            const params = {
                TableName: process.env.GROUP_TABLE,
                Item: {
                    id: uuid.v1(),
                    description: group.description,
                    owner: group.owner,
                    members: [group.owner],
                    prayers: [],
                    created: new Date().getTime()
                }
            };

            dynamoDb.put(params, (error, result) => {
                if (error) {
                    reject({ 'failed': 'Group put error: ' + error });
                } else {
                    resolve({ 'created': result.Item });
                }
            });
        });
    };

};