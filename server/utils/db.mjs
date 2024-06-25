// Create PostgreSQL Connection Pool here !
import * as pg from "pg";
const { Pool } = pg.default;

const connectionPool = new Pool({
  connectionString:
    "postgresql://postgres:Panpaking2003sql@localhost:5432/Build-Creating-Data-API-Assignment",
});

export default connectionPool;
