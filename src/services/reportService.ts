import {Pool} from 'pg';

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'task_node',
  user: 'postgres',
  password: 'root',
});

export async function generateReport(): Promise<any> {
  try {
    const result = await pool.query('SELECT * FROM wildberries_data');
    return result.rows;
  } catch (error) {
    console.error('Error generating report:', error);
    throw error;
  }
}

export async function generateBrandReport(): Promise<any> {
  try {
    const result = await pool.query('SELECT brand, COUNT(*) AS count FROM wildberries_data GROUP BY brand');
    return result.rows;
  } catch (error) {
    console.error('Error generating brand report:', error);
    throw error;
  }
}

export async function generateHighestPriceReport(): Promise<any> {
  try {
    const result = await pool.query('SELECT * FROM wildberries_data ORDER BY totalprice DESC LIMIT 10');
    return result.rows[0];
  } catch (error) {
    console.error('Error generating highest price report:', error);
    throw error;
  }
}

export async function generateTopExpensiveReport(): Promise<any> {
  try {
    const result = await pool.query('SELECT * FROM wildberries_data ORDER BY totalprice DESC LIMIT 5');
    return result.rows;
  } catch (error) {
    console.error('Error generating top expensive report:', error);
    throw error;
  }
}

export async function generateDetailedReportForOneItem(itemId: number): Promise<any> {
  try {
    const result = await pool.query('SELECT * FROM wildberries_data WHERE nmid = $1', [itemId]);
    return result.rows[0];
  } catch (error) {
    console.error('Error generating detailed report for one item:', error);
    throw error;
  }
}

export async function generateCategoryReport(): Promise<any> {
  try {
    const result = await pool.query('SELECT category, COUNT(*) AS count FROM wildberries_data GROUP BY category');
    return result.rows;
  } catch (error) {
    console.error('Error generating category report:', error);
    throw error;
  }
}
