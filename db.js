import AWS from "aws-sdk";
import { env } from "process";

// Update AWS config
AWS.config.update({
  accessKeyId: process.env.DB_ACCESS_KEY_ID, // Do NOT HARD-CODE your secret credentials here
  secretAccessKey: process.env.DB_SECRET_ACCESS_KEY, // Do NOT HARD-CODE your secret credentials here
  region: "us-east-1",
});

// Create DynamoDB service object
const db = new AWS.DynamoDB.DocumentClient({ apiVersion: "latest" });

export default db;
