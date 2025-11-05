
const { sendResponse } = require('../../responses');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { ScanCommand, DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const db = DynamoDBDocumentClient.from(client);

exports.handler = async (event, context) => {

   const command = new ScanCommand({
      TableName: 'dogs-sls-db',
      FilterExpression: "attribute_exists(#id)",
      ExpressionAttributeNames: {
        "#id" : "id"}
      });

    const { Items } = await db.send(command);

    return sendResponse(200, {success : true, dogs : Items});
}
