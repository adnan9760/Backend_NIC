
import { prisma } from "../../utilities/db.js";
import { notifyFromEvent } from "../../ws/notifier.js";
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await prisma.$transaction(async (tx) => {
            const user = await tx.user.delete({
                where: { id: Number(id) }
            });
            await tx.outboxEvent.create({
                data: {
                    eventType: 'USER_DELETED',
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
        //     eventType: 'USER_DELETED',
        //     payload: { userId: result.id }
        // });

        return res.status(200).json({ message: "User deleted", user: result });

    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({ error: "User nahi mila" });
        }
        return res.status(500).json({ message: "Something went wrong", error: error.message });
    }
};