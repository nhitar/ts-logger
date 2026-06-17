import express from 'express';

import * as statusController from '../controllers/statusController';

const statusRouter = express.Router();

statusRouter.get('/', statusController.getStatusController);

export default statusRouter;
