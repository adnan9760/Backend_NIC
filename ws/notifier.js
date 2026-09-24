import { broadcastToClients } from "./wsServer.js";


export const notifyFromEvent = (outboxEvent)=>{

    switch(outboxEvent.eventType){
        case 'USER_CREATED':
        case 'USER_UPDATED':
        case 'USER_DELETED':
            broadcastToClients({
                event:outboxEvent.eventType,
                data:outboxEvent.payload
            })
        break;
        default:
            console.log('Unknown event type:', outboxEvent.eventType);
    }


}