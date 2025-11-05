const { sendResponse } = require("../../responses");
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { UpdateCommand, DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({});
const db = DynamoDBDocumentClient.from(client);

exports.handler = async (event, context) => {
    const { dogId } = event.pathParameters;
    
    //{age: 9, color: 'black'}
    const updateAttributes = JSON.parse(event.body);

    const updateExpression = 'set ' + Object.keys(updateAttributes).map(attributeName => `${attributeName} = :${attributeName}`).join(', ');

    const expressionAttributeValues = Object.keys(updateAttributes).reduce((values, attributeName ) => {
        values[`:${attributeName}`] = updateAttributes[attributeName];
        return values;
    }, {});

    const command = new UpdateCommand({
            TableName: 'dogs-sls-db',
            Key: {id: dogId},
            ReturnValues: 'ALL_NEW',
            UpdateExpression: updateExpression, //'set age = :age, color = :color'
            ExpressionAttributeValues: expressionAttributeValues
            // {
            //  ':age' , age,
            //  ':color' , color 
            // }

        });

    try {
        await db.send(command);

        return sendResponse(200, {success: true});
    } catch (error) {
        return sendResponse(500 , {success: false, error: error });
    }

}