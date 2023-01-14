import type { NextApiRequest, NextApiResponse } from "next";
import { Trip } from "../../../services/lib/trips";

export default async function (req: NextApiRequest, res: NextApiResponse<any>) {
  // create a new trip
  // const params: PutItemInput = {
  //   TableName: "trips",
  //   Item: req.body,
  // };
  // db.put(params, function (err, data) {
  //   if (err) {
  //     console.log("Error", err);
  //   } else {
  //     res.json(data);
  //   }
  // });
}
