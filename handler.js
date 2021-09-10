// 'use strict';

// const AWS = require('aws-sdk')
// const documentClient = new AWS.DynamoDB.documentClient();
// const Dynamo = {
//   async get (ID, tableName) {
//     const params = {
//       tableName,
//       Key: {ID}
//     }

//     const data = await documentClient.get(params).promise()

//     if(!data || !data.Item) {
//       throw Error('Error in fetching the data')
//     } 
//     return data.Item
//   }
// }
// module.exports.hello = async (event) => {
//   // return {
//   //   statusCode: 200,
//   //   body: JSON.stringify({
//   //     name: 'Isha Gupta',
//   //     age: 24
//   //   }, 2)
//   // };
//   const user = await Dynamo.get(ID, 'information2').catch(err => {
//   console.log(err)
//   return null
//   })

//   if (!user) {
//   return {
//   StatusCode: 400,
//   body: JSON.stringify({
//     message: 'User not found'
//   })
//   }
//   }

//   if(user) {
//   return {
//   StatusCode: 200,
//   body: JSON.stringify(user)
//   }
//   }
//   // Use this code if you don't use the http event with the LAMBDA-PROXY integration
//   // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
// };
 

  
const AWS = require("aws-sdk");
const express = require("express");
const serverless = require("serverless-http");

const app = express();

const USERS_TABLE = process.env.USERS_TABLE;
const dynamoDbClient = new AWS.DynamoDB.DocumentClient();

app.use(express.json());

app.get("/isha/:userId", async function (req, res) {
  const params = {
    TableName: USERS_TABLE,
    Key: {
      userId: req.params.userId,
    },
  };

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
});


app.use((req, res, next) => {
  return res.status(404).json({
    error: "Not Found",
  });
});


module.exports.handler = serverless(app);