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
exports.itemSchema = void 0;
const axios_1 = __importDefault(require("axios"));
const zod_1 = require("zod");
exports.itemSchema = zod_1.z.object({
    date: zod_1.z.string(),
    lastChangeDate: zod_1.z.string(),
    warehouseName: zod_1.z.string(),
    countryName: zod_1.z.string(),
    oblastOkrugName: zod_1.z.string(),
    regionName: zod_1.z.string(),
    supplierArticle: zod_1.z.string(),
    nmId: zod_1.z.number(),
    barcode: zod_1.z.string(),
    category: zod_1.z.string(),
    subject: zod_1.z.string(),
    brand: zod_1.z.string(),
    techSize: zod_1.z.string(),
    incomeID: zod_1.z.number(),
    isSupply: zod_1.z.boolean(),
    isRealization: zod_1.z.boolean(),
    totalPrice: zod_1.z.number(),
    discountPercent: zod_1.z.number(),
    spp: zod_1.z.number(),
    forPay: zod_1.z.number(),
    finishedPrice: zod_1.z.number(),
    priceWithDisc: zod_1.z.number(),
    saleID: zod_1.z.string(),
    orderType: zod_1.z.string(),
    sticker: zod_1.z.string().optional(),
    gNumber: zod_1.z.string(),
    srid: zod_1.z.string()
});
const fetchData = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const wildberriesApiUrl = 'https://statistics-api-sandbox.wildberries.ru/api/v1/supplier/sales?dateFrom=2019-06-20';
        const wildberriesApiToken = 'eyJhbGciOiJFUzI1NiIsImtpZCI6IjIwMjQwNTA2djEiLCJ0eXAiOiJKV1QifQ.eyJlbnQiOjEsImV4cCI6MTczMjE2MjYzNiwiaWQiOiJiMjdkZGYzYi1mZjFjLTQ0NzEtYjQ4Yy0xOGExNTBhZWU2Y2EiLCJpaWQiOjQ2OTkyNzAsIm9pZCI6MTg0MDIsInMiOjAsInNpZCI6ImYyMzI3ZjVkLTViMDEtNWQ1MC05NjI5LTkyMTgwOTkzZDUxNCIsInQiOnRydWUsInVpZCI6NDY5OTI3MH0.Rx8HMupyWGYXhoIoqUffQKPRJKTW7-FrFljvgOk7SRfnGG82PLCLEEFhUcQHaskZir_k0nESgUwCQOHj2VZ77w';
        if (!wildberriesApiUrl || !wildberriesApiToken) {
            console.error('WILDBERRIES_API_URL or WILDBERRIES_API_TOKEN is not set');
            return;
        }
        const response = yield axios_1.default.get(wildberriesApiUrl, {
            headers: {
                Authorization: `Bearer ${wildberriesApiToken}`,
                'Accept': 'application/json'
            },
        });
        const data = response.data;
        console.log('Полученные данные:', data);
        data.forEach((item) => {
            try {
                const parsedItem = exports.itemSchema.parse(item);
                console.log('Успешно проверено:', parsedItem);
            }
            catch (validationError) {
                if (validationError instanceof zod_1.ZodError) {
                    console.error('Ошибка валидации:', validationError.errors);
                }
                else {
                    console.error('Неизвестная ошибка валидации:', validationError);
                }
                console.log('Проблемный элемент:', item);
            }
        });
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            console.error('Ошибка ответа сервера:', (_a = error.response) === null || _a === void 0 ? void 0 : _a.data);
        }
        else {
            console.error('Ошибка запроса:', error instanceof Error ? error.message : 'Unknown error');
        }
    }
});
fetchData();
