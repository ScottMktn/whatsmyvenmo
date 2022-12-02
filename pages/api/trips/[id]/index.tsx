import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../../../db";

export default async function (req: NextApiRequest, res: NextApiResponse<any>) {
  const id = req.query.id;
  const params = {
    TableName: "trips",
    Key: {
      uuid: id,
    },
  };

  db.get(params, function (err, data) {
    if (err) {
      console.log("Error", err);
    } else {
      res.json(data.Item);
    }
  });
}
