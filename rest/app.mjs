import AWS from 'aws-sdk';
import { nanoid } from 'nanoid';
const dynamoClient = new AWS.DynamoDB.DocumentClient()

const TABLE_NAME = 'products'

export const FetchAllProducts = async (event, context) => {
    const params = {
        TableName: TABLE_NAME
    }
    const products = await dynamoClient.scan(params).promise();
    return {
        'statusCode': 200,
        'body': JSON.stringify({
            products: products,
        })
    }
};
export const CreateProducts = async (event, context) => {
    const {title, price, description, image} = JSON.parse(event.body)
    const params = {
        TableName: TABLE_NAME,
        Item: {
            id: nanoid(5),
            title,
            price,
            description,
            image
        }
    }
    await dynamoClient.put(params).promise();
    return {
        'statusCode': 200,
        'body': JSON.stringify({
            message: 'Product created'
        })
    }
};
export const DeleteProduct = async (event, context) => {
    const params = {
        TableName: TABLE_NAME,
        Key: {
            id: event.pathParameters.id

        }
    }
    await dynamoClient.delete(params).promise();
    return {
        'statusCode': 200,
        'body': JSON.stringify({
            message: 'Product deleted'
        })
    }
};
export const UpdateProduct = async (event, context) => {
    const Item = JSON.parse(event.body)
    const params = {
        TableName: TABLE_NAME,
        Key: {
            id: event.pathParameters.id

        },
        UpdateExpression: 'set title= :t, price= :p, description= :d, image= :i',
        ExpressionAttributeValues: {
            ":t": Item.title,
            ":p": Item.price,
            ":d": Item.description,
            ":i": Item.image
        },
        ReturnValues: "UPDATED_NEW"
    }
    await dynamoClient.update(params).promise();
    return {
        'statusCode': 200,
        'body': JSON.stringify({
            message: 'user updated'
        })
    }
};
