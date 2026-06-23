import "dotenv/config";


if (!process.env.DATABASE_URL && process.env.NODE_ENV === "production") {
  console.warn("[WARNING] DATABASE_URL environment variable is missing. Falling back to the in-memory/mock database.");
}

export const env = {
  appId: process.env.APP_ID ?? "obe_app",
  appSecret: process.env.APP_SECRET ?? "default_secret_key_change_me_in_prod",
  isProduction: process.env.NODE_ENV === "production",
  databaseUrl: process.env.DATABASE_URL ?? "",
  ownerUnionId: process.env.OWNER_UNION_ID ?? "",
};
