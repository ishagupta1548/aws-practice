const AWS = require("aws-sdk");
const express = require("express");
const serverless = require("serverless-http");

const app = express();
const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

app.use(express.json());

app.get('/isha/:id', async function(req, res) {
    const params = {
        TableName: 'information3',
        Keys: {
            ID: req.params.id
        }
    }
    try {
        const { Item } = await dynamoDbClient.get(params).promise();
        if (Item) {
          const { userId, name } = Item;
          res.json({ userId, name });
        } else {
          res
            .status(404)
            .json({ error: 'Could not find user with provided "userId"' });
        }
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Could not retreive user" });
      }
})

module.exports.handler = serverless(app)