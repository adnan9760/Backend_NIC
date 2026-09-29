import { prisma } from '../../utilities/db.js'
import { notifyFromEvent } from '../../ws/notifier.js'

export const Insertoperation = async (req, res) => {
    try {
        
        const { email, name ,phone } = req.body;
        console.log("email",email)

        if (!email || !name) {
            return res.status(400).json({
                message: "Name and Email are required fields"
            })
        }

        

        const result = await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: { name, email ,phone}
            })

            await tx.outboxEvent.create({
                data: {
                    eventType: 'USER_CREATED',
                    aggregatedId: String(user.id),
                    payload: {
                        userId: user.id,
                        name: user.name,
                        email: user.email,
                        phone:user.phone
                    }
                }
            })

            return user;
        })

        // notifyFromEvent({
        //     eventType: 'USER_CREATED',
        //     payload: result
        // });

        return res.status(201).json({
            message: "User created successfully",
            user: result
        })

    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message
        })
    }
}