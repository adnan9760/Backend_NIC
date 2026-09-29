import redis from 'redis';

const client = redis.createClient({
    socket: {
        host: '127.0.0.1',
        port: 6379,
        connectTimeout: 10000
    }
});

// const client = redis.createClient({
//     url: process.env.REDIS_URL
// });

client.on('error', (err) => {
    console.error('Redis error:', err);
});

client.on('connect', () => {
    console.log('Connected to Redis');
});

await client.connect();

export default client;