import client from "../../Redis/RedisClient.js";
import { prisma } from '../../utilities/db.js'
async function getUsers(req, res) {
  try {
  await prisma.outboxEvent.deleteMany({});
    const cached = await client.get('user:all');
    console.log("cached",cached)
    if (cached) {
      return res.status(200).json({ message: "Users fetched (cached)", users: JSON.parse(cached) });
    }

    const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });
    await client.setEx('user:all', 300, JSON.stringify(users));

    return res.status(200).json({ message: "Users fetched successfully", users });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
}

export default getUsers;