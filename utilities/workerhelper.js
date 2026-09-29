import client from "../Redis/RedisClient.js";

const TTL_SECONDS = 30 * 60;
const getUserKey = (id) => `user:${id}`;   

export const updateUserCache = async (user) => {
    const id = user.userId;
    if (!id) {
        console.warn("updateUserCache: missing user id, skipping cache write");
        return;
    }
    const key = getUserKey(id);
    try {
        await client.setEx(key, TTL_SECONDS, JSON.stringify(user));
        await client.del('user:all');
    } catch (err) {
        console.error(`Cache update failed :`, err);
    }
};

export const deleteUserCache = async (userId) => {
    try {
        await client.del(getUserKey(userId));
        await client.del('user:all');
    } catch (err) {
        console.error(`Cache delete failed:`, err);
    }
};

export const getAllUsersFromCache = async () => {
    try {
        const all = await client.hGetAll('user:all');
        return Object.values(all).map(JSON.parse);
    } catch (err) {
        console.error(`Cache read failed:`, err);
        return null;
    }
};