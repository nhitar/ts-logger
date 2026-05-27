import express from 'express';

import * as statusService from '../services/statusService';

const router = express.Router();
router.get('/status', statusService.getStatus);

export default router;
