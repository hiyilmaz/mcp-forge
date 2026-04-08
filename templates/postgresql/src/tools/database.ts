import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function queryDatabase(sql: string) {
  if (!sql || sql.trim().length === 0) {
    throw new Error('SQL query cannot be empty');
  }
  
  try {
    const result = await pool.query(sql);
    return result.rows;
  } catch (error: any) {
    throw new Error(`Database error: ${error.message}`);
  }
}

export async function listTables() {
  try {
    const result = await pool.query(`
      SELECT tablename FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename
    `);
    return result.rows.map(row => row.tablename);
  } catch (error: any) {
    throw new Error(`Database error: ${error.message}`);
  }
}

export async function describeTable(tableName: string) {
  if (!tableName || tableName.trim().length === 0) {
    throw new Error('Table name cannot be empty');
  }
  
  try {
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = $1
      ORDER BY ordinal_position
    `, [tableName]);
    return result.rows;
  } catch (error: any) {
    throw new Error(`Database error: ${error.message}`);
  }
}
