import { env } from "../lib/env";
import * as schema from "@db/schema";
import * as relations from "@db/relations";
import { createRequire } from "module";

const fullSchema = { ...schema, ...relations };

let instance: any;

function createChainedProxy(defaultValue: any): any {
  const handler: ProxyHandler<any> = {
    get(_target, prop) {
      if (prop === "then") {
        return (resolve: any) => resolve(defaultValue);
      }
      return (..._args: any[]) => createChainedProxy(defaultValue);
    }
  };
  return new Proxy({}, handler);
}

function createMockDb(): any {
  const handler: ProxyHandler<any> = {
    get(_target, prop) {
      const propStr = String(prop);
      if (prop === "then") {
        return (resolve: any) => resolve([]);
      }
      return (...args: any[]) => {
        let defaultValue: any = [];
        if (propStr === "select" && args[0] && typeof args[0] === "object") {
          const keys = Object.keys(args[0]);
          if (keys.length > 0) {
            const mockRow: any = {};
            for (const k of keys) {
              mockRow[k] = 0;
            }
            defaultValue = [mockRow];
          }
        }
        return createChainedProxy(defaultValue);
      };
    }
  };
  return new Proxy({}, handler);
}

function wrapWithSafety(targetObj: any, fallbackValue: any = []): any {
  return new Proxy(targetObj, {
    get(target, prop) {
      if (prop === "then") {
        const originalThen = target.then;
        if (typeof originalThen === "function") {
          return function (resolve: any, _reject: any) {
            return originalThen.call(target, resolve, (err: any) => {
              console.warn(`[DB Query Warning] Database query failed (falling back to mock data):`, err.message || err);
              resolve(fallbackValue);
            });
          };
        }
      }

      const value = Reflect.get(target, prop);
      if (typeof value === "function") {
        return (...args: any[]) => {
          let nextFallback = fallbackValue;
          const propStr = String(prop);

          if (propStr === "select" && args[0] && typeof args[0] === "object") {
            const keys = Object.keys(args[0]);
            if (keys.length > 0) {
              const mockRow: any = {};
              for (const k of keys) {
                mockRow[k] = 0;
              }
              nextFallback = [mockRow];
            }
          }

          try {
            const result = value.apply(target, args);
            if (result && (typeof result === "object" || typeof result === "function")) {
              return wrapWithSafety(result, nextFallback);
            }
            return result;
          } catch (err) {
            console.warn(`[DB Method Warning] Method ${propStr} failed:`, err);
            return createChainedProxy(nextFallback);
          }
        };
      } else if (value && typeof value === "object") {
        return wrapWithSafety(value, fallbackValue);
      }
      return value;
    }
  });
}

export function getDb() {
  if (!env.databaseUrl) {
    return createMockDb();
  }
  try {
    if (!instance) {
      const require = createRequire(import.meta.url);
      const { drizzle } = require("drizzle-orm/mysql2");
      const rawDb = drizzle(env.databaseUrl, {
        mode: "planetscale",
        schema: fullSchema,
      });
      instance = wrapWithSafety(rawDb);
    }
    return instance;
  } catch (err) {
    console.warn("[DB] Failed to initialize database client (falling back to mock DB):", err);
    return createMockDb();
  }
}
