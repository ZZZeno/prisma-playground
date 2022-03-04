import PrismaClient from "@prisma/client"
import { createPrismaRedisCache, Middleware } from "prisma-redis-middleware"
import Redis from "ioredis"
const redis = new Redis() // Uses default options for Redis connection
const prisma = new PrismaClient.PrismaClient()

const mdw: Middleware = createPrismaRedisCache({
            models: ["User", "Post"],
            cacheTime: 300, // five minutes
            redis,
            excludeCacheMethods: ["findMany"],
        })

prisma.$use(mdw)

async function main() {
    // ... you will write your Prisma Client queries here
    const start = Date.now()
    const res = await prisma.user.findMany({
        where: {
            name: {
                endsWith: "8"
            }
        },
        orderBy: {
            email: "desc"
        }
    })
    const end = Date.now()
    console.log(`cost ${end-start}`)
}

main()
    .catch((e) => {
        throw e
    })
    .finally(async () => {
        await prisma.$disconnect()
    })