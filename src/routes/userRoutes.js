import express from 'express';
import { updateUser } from '../controller/updateoperation.js';
import { deleteUser } from '../controller/deleteopeartion.js';
import { Insertoperation } from '../controller/insertoperation.js';

const router = express.Router();

router.post('/users', Insertoperation);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

export default router;