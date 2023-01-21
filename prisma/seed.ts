import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
    const user = await prisma.user.create({
        data: {
            name: 'John Doe',
            email: 'john@doe.com',
            avatarUrl: 'http://github.com/doe.png',
        }
    })
    const pool = await prisma.pool.create({
        data: {
            title: 'Example Pool',
            code: 'BOL123',
            ownerId: user.id,

            participants: {
                create: {
                    userId: user.id
                }
            }
        }

    })

    await prisma.game.create({
        data: {
            date: '2022-11-20T12:15:20.165Z',
            firstTeamCountryCode: 'DE',
            secondTeamCountryCode: 'FR',

        }
    })

    await prisma.game.create({
        data: {
            date: '2022-11-21T12:15:20.165Z',
            firstTeamCountryCode: 'BR',
            secondTeamCountryCode: 'AR',

            guesses: {
                create: {
                    firstTeamPoints: 2,
                    secondTeamPoints: 1,

                    participant: {
                        connect: {
                            userId_poolId: {
                                userId: user.id,
                                poolId: pool.id
                            }
                        }
                    }
                }
            }
        },
    })

}

main()