// module imports
import express, { Request, Response } from 'express';
import { IRequest } from '../../configs/types';
// file imports
import * as followController from './controller';
import { exceptionHandler } from '../../middlewares/exception-handler';
import {
  verifyToken,
  verifyAdmin,
  verifyUser,
} from '../../middlewares/authenticator';

// variable initializations
const router = express.Router();

router
  .route('/:followingId')
  .all(verifyToken, verifyUser)
  .post(
    exceptionHandler(async (req: IRequest, res: Response) => {
      const followerId = req.user._id;
      let { followingId } = req.params;
      const args = { following: followingId, follower: followerId };
      const response = await followController.addFollow(args);
      res.json(response);
    })
  );

router.delete(
  '/:followingId',
  verifyToken,
  verifyUser,
  exceptionHandler(async (req: IRequest, res: Response) => {
    const followerId = req.user._id;
    let { followingId } = req.params;
    followingId = followingId?.toString() || '';
    const args = { following: followingId, follower: followerId };
    const response = await followController.deleteFollow(args);
    res.json(response);
  })
);

router.get(
  '/myfollowers',
  verifyToken,
  verifyUser,
  exceptionHandler(async (req: IRequest, res: Response) => {
    const { limit, page } = req.query;
    const userId = req.user._id;
    const args = { userId, limit: Number(limit), page: Number(page) };
    const response = await followController.getMyFollowers(args);
    res.json(response);
  })
);

router.get(
  '/myfollowing',
  verifyToken,
  verifyUser,
  exceptionHandler(async (req: IRequest, res: Response) => {
    const { limit, page } = req.query;
    const userId = req.user._id;
    const args = { userId, limit: Number(limit), page: Number(page) };
    const response = await followController.getMyFollowing(args);
    res.json(response);
  })
);
export default router;
