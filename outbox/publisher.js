import amqp from 'amqplib';
import { prisma }  from "../utilities/db.js"

let channel;


export const StartOutBoxPublisher = async()=>{
    const conn = await amqp.connect(process.env.RABBITMQ_URL);
    channel = await conn.createChannel();
    await channel.assertQueue(process.env.QUEUE_NAME, { durable: true });
    setInterval(pollAndPublish, 3000);
}


const pollAndPublish = async ()=>{
    try {
        const events = await prisma.outboxEvent.findMany({
            where: { status: 'pending' },
            orderBy: { createdAt: 'asc' },
            take: 20
        })
        
        for( const event of events){
            try {
                 channel.sendToQueue(
                    process.env.QUEUE_NAME,
                    Buffer.from(JSON.stringify({
                         eventType: event.eventType,
                        aggregatedId: event.aggregatedId,
                        payload: event.payload
                    })),
                    {persistent:true}
                    
                 )

                  await prisma.outboxEvent.update({
                    where: { id: event.id },
                    data: { status: 'sent', sentAt: new Date() }
                });
            } catch (error) {
                console.error(error)
            }
        }
    } catch (error) {
          console.error('Polling error:', error.message);
    }
}