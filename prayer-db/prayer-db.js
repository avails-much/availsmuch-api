'use strict'

const uuid = require('uuid');
const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (prayerRequest, success, failure) => {
    const params = {
        TableName: process.env.PRAYER_TABLE,
        Item: {
            id: uuid.v1(),
            description: prayerRequest.description,
            owner: prayerRequest.owner,
            prayedForCount: 0,
            answered: prayerRequest.answered,
            created: new Date().getTime(),
            answeredDate: prayerRequest.answeredDate
        }
    };

    dynamoDb.put(params, (error, result) => {
        if (error) {
            failure({ 'failed': 'Prayer put error: ' + error });
        } else {
            success({ 'created': result.Item });
        }
    });
};

module.exports.delete = (prayerId, success, failure) => {
    const params = {
        TableName: process.env.PRAYER_TABLE,
        Key: {
            id: prayerId,
        },
    };

    dynamoDb.delete(params, (error) => {
        if (error) {
            failure({ 'failed': 'Prayer delete error: ' + error });
        } else {
            success({ 'removed': prayerId });
        }
    });
};

module.exports.get = (prayerId, success, failure) => {
    const params = {
        TableName: process.env.PRAYER_TABLE,
        Key: {
            id: prayerId,
        },
    };

    dynamoDb.get(params, (error, result) => {
        if (error) {
            failure({ 'failed': 'Prayer get error: ' + error });
        } else {
            success({ 'prayer': result.Item });
        }
    });
};

module.exports.list = (success, failure) => {
    const params = {
        TableName: process.env.PRAYER_TABLE,
    };

    dynamoDb.scan(params, (error, result) => {
        if (error) {
            failure({'failed': 'Prayer list error: ' + error });
        } else {
            success({ 'prayers': result.Items });
        }
    });
};

module.exports.update = () => {
    console.error('not implemented');
    return ({'failed' : 'not implemented'});
};