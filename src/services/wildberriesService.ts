import axios from 'axios';
import { Pool } from 'pg';
import { itemSchema } from '../types/WildberriesData';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

export async function fetchAndStoreWildberriesData() {
  try {
    const url = process.env.WILDBERRIES_API_URL || '';
    const token = process.env.WILDBERRIES_API_TOKEN || '';

    const response = await axios.get(url, {
      params: {
        dateFrom: '2019-06-20'
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = response.data;

    for (const item of data) {
      try {
        const parsedItem = itemSchema.parse(item);
        await pool.query(
          `INSERT INTO wildberries_data (
            date, lastChangeDate, warehouseName, countryName, oblastOkrugName,
            regionName, supplierArticle, nmId, barcode, category, subject, brand,
            techSize, incomeID, isSupply, isRealization, totalPrice, discountPercent,
            spp, forPay, finishedPrice, priceWithDisc, saleID, orderType, sticker,
            gNumber, srid
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17,
            $18, $19, $20, $21, $22, $23, $24, $25, $26, $27
          ) ON CONFLICT (nmId) DO NOTHING`,
          [
            parsedItem.date,
            parsedItem.lastChangeDate,
            parsedItem.warehouseName,
            parsedItem.countryName,
            parsedItem.oblastOkrugName,
            parsedItem.regionName,
            parsedItem.supplierArticle,
            parsedItem.nmId,
            parsedItem.barcode,
            parsedItem.category,
            parsedItem.subject,
            parsedItem.brand,
            parsedItem.techSize,
            parsedItem.incomeID,
            parsedItem.isSupply,
            parsedItem.isRealization,
            parsedItem.totalPrice,
            parsedItem.discountPercent,
            parsedItem.spp,
            parsedItem.forPay,
            parsedItem.finishedPrice,
            parsedItem.priceWithDisc,
            parsedItem.saleID,
            parsedItem.orderType,
            parsedItem.sticker,
            parsedItem.gNumber,
            parsedItem.srid
          ]
        );
      } catch (error) {
        console.error('Error parsing or storing item:', item, error);
      }
    }
  } catch (error) {
    console.error('Error fetching data from Wildberries API:', error);
    throw error;
  }
}
