import type { NextApiRequest, NextApiResponse } from "next";

export default async function (req: NextApiRequest, res: NextApiResponse<any>) {
  // get the trip information from id
  // const id = req.query.id;
  // const params = {
  //   TableName: "trips",
  //   Key: {
  //     uuid: id,
  //   },
  // };
  // db.get(params, function (err, data) {
  //   if (err) {
  //     console.log("Error", err);
  //   } else {
  //     res.json(data.Item);
  //   }
  // });
}
