"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchAndStoreWildberriesData = void 0;
const axios_1 = __importDefault(require("axios"));
const pg_1 = require("pg");
const WildberriesData_1 = require("../types/WildberriesData");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const pool = new pg_1.Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});
function fetchAndStoreWildberriesData() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const url = process.env.WILDBERRIES_API_URL || '';
            const token = process.env.WILDBERRIES_API_TOKEN || '';
            const response = yield axios_1.default.get(url, {
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
                    const parsedItem = WildberriesData_1.itemSchema.parse(item);
                    yield pool.query(`INSERT INTO wildberries_data (
            date, lastChangeDate, warehouseName, countryName, oblastOkrugName,
            regionName, supplierArticle, nmId, barcode, category, subject, brand,
            techSize, incomeID, isSupply, isRealization, totalPrice, discountPercent,
            spp, forPay, finishedPrice, priceWithDisc, saleID, orderType, sticker,
            gNumber, srid
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17,
            $18, $19, $20, $21, $22, $23, $24, $25, $26, $27
          ) ON CONFLICT (nmId) DO NOTHING`, [
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
                    ]);
                }
                catch (error) {
                    console.error('Error parsing or storing item:', item, error);
                }
            }
        }
        catch (error) {
            console.error('Error fetching data from Wildberries API:', error);
            throw error;
        }
    });
}
exports.fetchAndStoreWildberriesData = fetchAndStoreWildberriesData;
