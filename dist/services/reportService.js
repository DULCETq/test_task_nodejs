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
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCategoryReport = exports.generateDetailedReportForOneItem = exports.generateTopExpensiveReport = exports.generateHighestPriceReport = exports.generateBrandReport = exports.generateReport = void 0;
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    host: 'localhost',
    port: 5432,
    database: 'task_node',
    user: 'postgres',
    password: 'root',
});
function generateReport() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield pool.query('SELECT * FROM wildberries_data');
            return result.rows;
        }
        catch (error) {
            console.error('Error generating report:', error);
            throw error;
        }
    });
}
exports.generateReport = generateReport;
function generateBrandReport() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield pool.query('SELECT brand, COUNT(*) AS count FROM wildberries_data GROUP BY brand');
            return result.rows;
        }
        catch (error) {
            console.error('Error generating brand report:', error);
            throw error;
        }
    });
}
exports.generateBrandReport = generateBrandReport;
function generateHighestPriceReport() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield pool.query('SELECT * FROM wildberries_data ORDER BY totalprice DESC LIMIT 10');
            return result.rows[0];
        }
        catch (error) {
            console.error('Error generating highest price report:', error);
            throw error;
        }
    });
}
exports.generateHighestPriceReport = generateHighestPriceReport;
function generateTopExpensiveReport() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield pool.query('SELECT * FROM wildberries_data ORDER BY totalprice DESC LIMIT 5');
            return result.rows;
        }
        catch (error) {
            console.error('Error generating top expensive report:', error);
            throw error;
        }
    });
}
exports.generateTopExpensiveReport = generateTopExpensiveReport;
function generateDetailedReportForOneItem(itemId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield pool.query('SELECT * FROM wildberries_data WHERE nmid = $1', [itemId]);
            return result.rows[0];
        }
        catch (error) {
            console.error('Error generating detailed report for one item:', error);
            throw error;
        }
    });
}
exports.generateDetailedReportForOneItem = generateDetailedReportForOneItem;
function generateCategoryReport() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield pool.query('SELECT category, COUNT(*) AS count FROM wildberries_data GROUP BY category');
            return result.rows;
        }
        catch (error) {
            console.error('Error generating category report:', error);
            throw error;
        }
    });
}
exports.generateCategoryReport = generateCategoryReport;
