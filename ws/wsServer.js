import {WebSocketServer} from 'ws'
let wss;
const client = new Set();


export const initWebSocketServer =(server)=>{
  
        wss = new WebSocketServer({server});

        wss.on('connection',(ws)=>{
             console.log('New Client, Total clients:', client.size + 1);
        client.add(ws);
          ws.on('close',()=>{
            client.delete(ws);
            console.log("Client Disconnected")
          })
          ws.on('error',(err)=>{
               console.error('WebSocket error:', err.message);
          })




        })

     console.log('WebSocket Server ready hai');
}

export const broadcastToClients = (data) => {
    const message = JSON.stringify(data);

    client.forEach((client) => {
        if (client.readyState === client.OPEN) {
            client.send(message);
        }
    });
};