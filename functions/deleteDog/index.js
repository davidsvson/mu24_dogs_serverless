const { sendResponse } = require("../../responses");
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DeleteCommand, DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const db = DynamoDBDocumentClient.from(client);
// DELETE /dogs/{dogId}

exports.handler = async (event, context) => {

    const { dogId } = event.pathParameters;

    const command = new DeleteCommand({
        TableName: 'dogs-sls-db',
        Key : { id: dogId}
    });

    try {
    
        await db.send(command);
        

        return sendResponse(200, {success : true});
    } catch (error) {
        return sendResponse(500, {success : false, message: 'could not delete dog'});
    }

}