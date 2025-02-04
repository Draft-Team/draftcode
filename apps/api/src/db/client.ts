import { createClient, type Client } from "@libsql/client"
import { drizzle } from "drizzle-orm/libsql"

import * as schema from "./schema"
import { env } from "@/environment/env"

const globalForDb = globalThis as unknown as {
	client: Client | undefined
}

const config = {
	authToken: env.DATABASE_AUTH_TOKEN,
	url: env.NODE_ENV === "production" ? env.DATABASE_URL : env.DATABASE_URL_DEV
} satisfies { url: string; authToken: string }

export const client = globalForDb.client ?? createClient(config)

if (env.NODE_ENV === "production") globalForDb.client = client

export const db = drizzle(client, {
	schema
})
