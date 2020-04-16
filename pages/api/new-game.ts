import newGame from "../../lib/newGame";
import { NextApiRequest, NextApiResponse } from "next";

export default (req: NextApiRequest, res: NextApiResponse) => {
  res.json({ game: newGame() });
};
