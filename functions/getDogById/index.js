const { sendResponse } = require("../../responses");
const AWS = require('aws-sdk'); 
const db = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
    const { dogId } = event.pathParameters;    

    // const command = new GetCommand({
    //  TableName: 'dogs-sls-db',
    //         Key: {id: dogId}
    // })

    try {
        const { Item } = await db.get({
            TableName: 'dogs-sls-db',
            Key: {id: dogId}

        }).promise();

        // const { Item } = await db.send(command);

        if (Item) {
            return sendResponse(200, { succes: true, dog: Item});
        } else {
            return sendResponse(404, {success: false, message: 'Dog not found'} );
        }
    } catch (error) {
        return sendResponse(500, {success: false, message: 'Could not fetch dog'} );
    }
}