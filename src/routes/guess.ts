import { FastifyInstance } from "fastify"
import { z } from "zod"
import { prisma } from "../lib/prisma"
import { authenticate } from "../plugins/authenticate"

export async function guessRoutes(fastify: FastifyInstance) {
    fastify.get('/guesses/count', async () => {
        const count = await prisma.guess.count()


        return { count }
    })

    fastify.post('/pools/:poolId/games/:gameId/guesses', {
        onRequest: [authenticate]
    }, async (request, reply) => {
        const createGuessParams = z.object({
            poolId: z.string(),
            gameId: z.string()
        })

        const createGuessBody = z.object({
            firstTeamPoints: z.number(),
            secondTeamPoints: z.number(),

        })

        const { poolId, gameId } = createGuessParams.parse(request.params)
        const { firstTeamPoints, secondTeamPoints } = createGuessBody.parse(request.body)

        const participant = await prisma.participant.findUnique({
            where: {
                userId_poolId: {
                    poolId,
                    userId: request.user.sub
                }
            }
        })

        if (!participant) {
            return reply.code(404).send({
                message: 'Not Found'
            })
        }

        const guess = await prisma.guess.findUnique({
            where: {
                participantId_gameId: {
                    participantId: participant.id,
                    gameId,
                }
            }
        })

        if (guess) {
            return reply.code(404).send({
                message: 'Already GUESSED'
            })
        }

        const game = await prisma.game.findUnique({
            where: {
                id: gameId
            }

        })

        if (!game) {
            return reply.code(404).send({
                message: 'Not Found'
            })
        }

        if (game.date < new Date()) {
            return reply.code(404).send({
                message: 'Time out: You cannot sen guesses after the game date has passed'
            })
        }

        await prisma.guess.create({
            data: {
                gameId,
                participantId: participant.id,
                firstTeamPoints,
                secondTeamPoints
            }

        })

        return reply.code(201).send({})
    })
}