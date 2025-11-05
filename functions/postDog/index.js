
const { sendResponse } = require('../../responses');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { PutCommand, DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const db = DynamoDBDocumentClient.from(client);

exports.handler = async (event, context) => {
    const dog = JSON.parse(event.body);

    const timestamp = new Date().getTime();

    dog.id = `${timestamp}`;

    const command = new PutCommand({
            TableName: 'dogs-sls-db',
            Item: dog
    });

    try {
        await db.send(command);

        return sendResponse(200, {success: true});
    } catch (error) {
        return sendResponse(500, {success: false});
    }
}