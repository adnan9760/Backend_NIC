import express from 'express';
import { updateUser } from '../controller/updateoperation.js';
import { deleteUser } from '../controller/deleteopeartion.js';
import { Insertoperation } from '../controller/insertoperation.js';
import getUsers from '../controller/fetchoperation.js';

const router = express.Router();

router.post('/users', Insertoperation);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/users/getuser',getUsers)

export default router;