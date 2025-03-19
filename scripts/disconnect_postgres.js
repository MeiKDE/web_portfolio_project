import pkg from "pg";
const { Client } = pkg;
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

async function disconnectAllClients() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log("Connected to PostgreSQL");

    // Get current database name from the connection string
    const databaseName = process.env.DATABASE_URL.split("/")
      .pop()
      .split("?")[0];

    // Query to get all active connections to this database
    const result = await client.query(`
      SELECT pid, application_name, client_addr, state, query_start
      FROM pg_stat_activity
      WHERE datname = '${databaseName}'
      AND pid <> pg_backend_pid() -- Exclude the current connection
      AND state = 'active';
    `);

    console.log(`Found ${result.rows.length} active connections`);

    // Terminate each connection
    for (const row of result.rows) {
      console.log(
        `Terminating connection: PID=${row.pid}, App=${row.application_name}`
      );
      await client.query(`SELECT pg_terminate_backend(${row.pid});`);
    }

    console.log("All connections terminated successfully");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await client.end();
    console.log("Disconnected from PostgreSQL");
  }
}

disconnectAllClients();
