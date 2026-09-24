import client from "../Redis/RedisClient.js";

const TTL_SECONDS = 30 * 60; 

export const updateUserCache = async (user) => {
    const key = `user:${user.userId || user.id}`;
    await client.setEx(key, TTL_SECONDS, JSON.stringify(user));
    console.log(`Cache updated: ${key}`);
};

export const deleteUserCache = async (userId) => {
    const key = `user:${userId}`;
    await client.del(key);
    console.log(`Cache deleted: ${key}`);
};

export const getUserFromCache = async (userId) => {
    const key = `user:${userId}`;
    const cached = await client.get(key);
    return cached ? JSON.parse(cached) : null;
};