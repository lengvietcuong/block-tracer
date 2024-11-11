"server-only";

import neo4j, { Driver } from "neo4j-driver";

export function initializeNeo4j() {
  const neo4jUrl = process.env.NEO4J_URL;
  const neo4jUser = process.env.NEO4J_USER;
  const neo4jPassword = process.env.NEO4J_PASSWORD;

  if (!neo4jUrl || !neo4jUser || !neo4jPassword) {
    throw new Error("Missing Neo4j connection credentials");
  }
  return neo4j.driver(neo4jUrl, neo4j.auth.basic(neo4jUser, neo4jPassword));
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function runQuery(driver: Driver, query: string, params?: any) {
  const session = driver.session();
  try {
    return await session.run(query, params);
  } finally {
    await session.close();
  }
}
