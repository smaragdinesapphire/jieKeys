import { NextApiRequest, NextApiResponse } from 'next';
import getChangeLogDatas from '../../mySrc/utils/api/getChangeLogDatas/getChangeLogDatas';

export default (req: NextApiRequest, res: NextApiResponse): void => {
  let tmp;
  try {
    const { query } = req;
    const { page, pitem } = query;
    getChangeLogDatas({ page: Number(page), pitem: Number(pitem) }).then(result => {
      tmp = result;
      res.status(200).json(result);
    });
  } catch (e) {
    res.status(500).json({ err: e.message, tmp });
  }
};
