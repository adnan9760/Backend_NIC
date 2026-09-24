import amqp from 'amqplib';
import { notifyFromEvent } from '../ws/notifier.js';
import client from '../Redis/RedisClient.js';
import { updateUserCache } from '../utilities/workerhelper.js';
import { deleteUserCache } from '../utilities/workerhelper.js';
import { prisma } from '../utilities/db.js';

const REFRESH_QUEUE='cache_refresh_queue';

export const StartConsumerWorker =async()=>{
    const conn = await amqp.connect(process.env.RABBITMQ_URL);
    const channel = await conn.createChannel();
    await  channel.assertQueue(process.env.QUEUE_NAME,{durable:true});
    await channel.assertQueue(REFRESH_QUEUE,{durable:true})

    channel.prefetch(1);
    channel.consume(process.env.QUEUE_NAME,async(msg)=>{
        if(msg === null){
return;
        }
        try {
            const event = JSON.parse(msg.content.toString());
            console.log("event",event)

               if (event.eventType === 'USER_CREATED' || event.eventType === 'USER_UPDATED') {
                await updateUserCache(event.payload);
            } else if (event.eventType === 'USER_DELETED') {
                await deleteUserCache(event.payload.userId);
            }

            notifyFromEvent(event);

            channel.ack(msg);

        } catch (err) {
            console.error('Event process karte waqt error:', err.message);
            channel.nack(msg, false, true);
        }
    },

    channel.consume(REFRESH_QUEUE, async (msg) => {
        if (msg === null) return;
        try {
            

            const users = await prisma.user.findMany();

            for (const user of users) {
                await updateUserCache(user);
            }

            console.log(`Cache refresh complete: ${users.length} users updated`);
            channel.ack(msg);
        } catch (err) {
            console.error('Cache refresh error:', err.message);
            channel.nack(msg, false, true);
        }
    })

)
}
