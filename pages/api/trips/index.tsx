import { PutItemInput } from "aws-sdk/clients/dynamodb";
import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../db";
import { Trip } from "../../../services/trips";

export default async function (req: NextApiRequest, res: NextApiResponse<any>) {
  const params: PutItemInput = {
    TableName: "trips",
    Item: req.body,
  };
  db.put(params, function (err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      res.json(data);
    }
  });
}
