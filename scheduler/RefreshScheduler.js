import amqp from 'amqplib';
import cron from 'node-cron';


const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
const REFRESH_QUEUE='cache_refresh_queue'
let channel;

export const startRedisScdeular = async()=>{
    const conn = await amqp.connect(RABBITMQ_URL);
    channel = await conn.createChannel()
    await channel.assertQueue(REFRESH_QUEUE,{durable:true})

    cron.schedule('*/30 * * * *',async()=>{
         channel.sendToQueue(
            REFRESH_QUEUE,
            Buffer.from(JSON.stringify({ eventType: 'CACHE_REFRESH', triggeredAt: new Date() })),
            { persistent: true }
        );
    })

}