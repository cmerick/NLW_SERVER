import Fastify from 'fastify';
import cors from '@fastify/cors'
import jwt from '@fastify/jwt';
import { poolRoutes } from './routes/pool';
import { guessRoutes } from './routes/guess';
import { userRoutes } from './routes/user';
import { gameRoutes } from './routes/game';
import { authRoutes } from './routes/auth';


//singleton 

async function start() {
    const fastify = Fastify({
        logger: true,
    })


    await fastify.register(cors, {
        origin: true,

    })

    //em produção precisa ser uma variável ambiente

    await fastify.register(jwt, {
        secret: 'nlwcopa',

    })

    await fastify.register(poolRoutes)

    await fastify.register(guessRoutes)

    await fastify.register(userRoutes)

    await fastify.register(gameRoutes)

    await fastify.register(authRoutes)






    await fastify.listen({ port: 3333, host: '0.0.0.0' })
}

start();