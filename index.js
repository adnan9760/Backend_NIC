
import express from 'express';
import http from 'http';
import userRoutes from './src/routes/userRoutes.js';
import { initWebSocketServer } from './ws/wsServer.js';
import { StartOutBoxPublisher } from './outbox/publisher.js';
import { StartConsumerWorker } from './worker/consumer.js';

const app = express();
app.use(express.json());


app.use('/api/v1', userRoutes);

const server = http.createServer(app);

initWebSocketServer(server);
StartOutBoxPublisher().catch((err)=>{ console.error('Outbox Publisher start nahi ho paya:', err.message);})

StartConsumerWorker().catch((err)=>{console.err('Consumer Start nhi ho paya!!')})

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server (HTTP + WebSocket) chal raha hai: http://localhost:${PORT}`);
});