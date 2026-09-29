
import { prisma } from '../../utilities/db.js';
import { notifyFromEvent } from '../../ws/notifier.js';

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;

        if (!name && !email) {
            return res.status(400).json({ error: "We Just Required min One field for the Updatetion" });
        }

        const result = await prisma.$transaction(async (tx) => {

            const user = await tx.user.update({
                where: { id: Number(id) },
                data: {
                    ...(name && { name }),
                    ...(email && { email })
                }
            });

            await tx.outboxEvent.create({
                data: {
                    eventType: 'USER_UPDATED',
                    aggregatedId: String(user.id),
                    payload: {
                        userId: user.id,
                        name: user.name,
                        email: user.email
                    }
                }
            });

            return user;
        });
        // notifyFromEvent({
        //     eventType: 'USER_UPDATED',
        //     payload: result
        // });

        return res.status(200).json({ message: "User updated", user: result });

    } catch (error) {
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};