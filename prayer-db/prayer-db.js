'use strict'

const uuid = require('uuid');
const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (prayerRequest) => {
    return new Promise((resolve, reject) => {
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
                reject({ 'failed': 'Prayer put error: ' + error });
            } else {
                resolve({ 'created': result.Item });
            }
        });
    });
};

module.exports.delete = (prayerId) => {
    return new Promise((resolve, reject) => {
        const params = {
            TableName: process.env.PRAYER_TABLE,
            Key: {
                id: prayerId,
            },
        };

        dynamoDb.delete(params, (error) => {
            if (error) {
                reject({ 'failed': 'Prayer delete error: ' + error });
            } else {
                resolve({ 'removed': prayerId });
            }
        });
    });
};

module.exports.get = (prayerId) => {
    return new Promise((resolve, reject) => {
        const params = {
            TableName: process.env.PRAYER_TABLE,
            Key: {
                id: prayerId,
            },
        };

        dynamoDb.get(params, (error, result) => {
            if (error) {
                reject({ 'failed': 'Prayer get error: ' + error });
            } else {
                resolve({ 'prayer': result.Item });
            }
        });
    });
};

module.exports.list = () => {
    return new Promise((resolve, reject) => {
        const params = {
            TableName: process.env.PRAYER_TABLE,
        };

        dynamoDb.scan(params, (error, result) => {
            if (error) {
                reject({ 'failed': 'Prayer list error: ' + error });
            } else {
                resolve({ 'prayers': result.Items });
            }
        });
    });
};
