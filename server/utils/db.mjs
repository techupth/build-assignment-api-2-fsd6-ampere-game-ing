// Create PostgreSQL Connection Pool here !
import * as pg from "pg";
const { Pool } = pg.default;

const connectionPool = new Pool({
  connectionString:
    "postgresql://postgres:Iammarquiz154963@localhost:5432/HackHour",
});

export default connectionPool;
