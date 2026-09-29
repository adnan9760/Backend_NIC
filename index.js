
import express from 'express';
import http from 'http';
import cors from 'cors'
import userRoutes from './src/routes/userRoutes.js';
import { initWebSocketServer } from './ws/wsServer.js';
import { StartOutBoxPublisher } from './outbox/publisher.js';
import { StartConsumerWorker } from './worker/consumer.js';
import { prisma } from './utilities/db.js';

const app = express();
app.use(cors());
app.use(express.json());


app.use('/api/v1', userRoutes);

const server = http.createServer(app);


initWebSocketServer(server);
StartOutBoxPublisher().catch((err)=>{ console.error('Some Erorro occure :', err.message);})

StartConsumerWorker().catch((err)=>{console.err('Error When it running')})

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server is Running and Websocket also open`);
});