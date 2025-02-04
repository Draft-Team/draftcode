import { createClient, type Client } from "@libsql/client"
import { drizzle } from "drizzle-orm/libsql"

import * as schema from "./schema"
import { env } from "@/environment/env"

const globalForDb = globalThis as unknown as {
	client: Client | undefined
}

const isProd = env.NODE_ENV === "production"

const config = {
	url: isProd ? env.DATABASE_URL : env.DATABASE_URL_DEV,
	authToken: isProd ? env.DATABASE_AUTH_TOKEN : undefined
} satisfies { url: string; authToken?: string }

export const client = globalForDb.client ?? createClient(config)

if (isProd) globalForDb.client = client

export const db = drizzle(client, {
	schema
})
