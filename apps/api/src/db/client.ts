import { createClient, type Client } from "@libsql/client"
import { drizzle } from "drizzle-orm/libsql"

import * as schema from "./schema"
import { env } from "@/environment/env"

const globalForDb = globalThis as unknown as {
	client: Client | undefined
}

const url = env.NODE_ENV === "production" ? env.DATABASE_URL : env.DATABASE_URL_DEV

export const client = globalForDb.client ?? createClient({ url })

if (env.NODE_ENV === "production") globalForDb.client = client

export const db = drizzle(client, {
	schema
})
