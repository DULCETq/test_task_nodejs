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
exports.initializeBot = void 0;
const telegraf_1 = require("telegraf");
const reportService_1 = require("../services/reportService");
function initializeBot() {
    const bot = new telegraf_1.Telegraf(process.env.TELEGRAM_BOT_TOKEN || '');
    bot.start((ctx) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield ctx.reply('Привет! Я бот отчетов. Выберите тип отчета:', {
                reply_markup: {
                    keyboard: [
                        ['Общий отчет', 'Общий отчет по 1 товару', 'Отчет по категориям', 'Отчет по бренду'],
                        ['Отчет о самом дорогом товаре', 'Топ-5 самых дорогих товаров']
                    ],
                    one_time_keyboard: true,
                    resize_keyboard: true
                }
            });
        }
        catch (error) {
            console.error('Ошибка при запуске бота:', error);
            ctx.reply('Ошибка при запуске бота');
        }
    }));
    bot.command('stop', (ctx) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield ctx.reply('Вы завершили текущий разговор.', telegraf_1.Markup.removeKeyboard());
        }
        catch (error) {
            console.error('Ошибка при завершении разговора:', error);
            ctx.reply('Ошибка при завершении разговора');
        }
    }));
    bot.on('text', (ctx) => __awaiter(this, void 0, void 0, function* () {
        const text = ctx.message.text;
        switch (text) {
            case 'Общий отчет':
                try {
                    const report = yield (0, reportService_1.generateReport)();
                    let reportText = 'Отчет:\n\n';
                    report.forEach((item) => {
                        reportText += `ID: ${item.nmid}, Article: ${item.supplierarticle}, Total Price: ${item.totalprice}, For Pay: ${item.forpay}\n`;
                    });
                    ctx.reply(reportText);
                }
                catch (error) {
                    console.error('Ошибка при формировании общего отчета:', error);
                    ctx.reply('Ошибка при формировании общего отчета');
                }
                break;
            case 'Общий отчет по 1 товару':
                try {
                    const itemId = 84710727;
                    const detailedReport = yield (0, reportService_1.generateDetailedReportForOneItem)(itemId);
                    let reportText = 'Отчет по одному товару:\n\n';
                    for (const key in detailedReport) {
                        reportText += `${key}: ${detailedReport[key]}\n`;
                    }
                    ctx.reply(reportText);
                }
                catch (error) {
                    console.error('Ошибка при формировании общего отчета по одному товару:', error);
                    ctx.reply('Ошибка при формировании общего отчета по одному товару');
                }
                break;
            case 'Отчет по бренду':
                try {
                    const brandReport = yield (0, reportService_1.generateBrandReport)();
                    let reportText = 'Отчет по бренду:\n\n';
                    brandReport.forEach((brandItem) => {
                        reportText += `Бренд: ${brandItem.brand}, Количество товаров: ${brandItem.count}\n`;
                    });
                    ctx.reply(reportText);
                }
                catch (error) {
                    console.error('Ошибка при формировании отчета по брендам:', error);
                    ctx.reply('Ошибка при формировании отчета по брендам');
                }
                break;
            case 'Отчет о самом дорогом товаре':
                try {
                    const highestPriceItem = yield (0, reportService_1.generateHighestPriceReport)();
                    if (highestPriceItem) {
                        const { nmid, supplierarticle, totalprice, forpay } = highestPriceItem;
                        const reportText = `Самый дорогой товар:\nID: ${nmid}, Article: ${supplierarticle}, Total Price: ${totalprice}, For Pay: ${forpay}`;
                        ctx.reply(reportText);
                    }
                    else {
                        ctx.reply('Отчет по самой высокой цене недоступен. Нет данных.');
                    }
                }
                catch (error) {
                    console.error('Ошибка при формировании отчета по самой высокой цене:', error);
                    ctx.reply('Ошибка при формировании отчета по самой высокой цене');
                }
                break;
            case 'Топ-5 самых дорогих товаров':
                try {
                    const topExpensiveItems = yield (0, reportService_1.generateTopExpensiveReport)();
                    let reportText = 'Топ-5 самых дорогих товаров:\n\n';
                    topExpensiveItems.forEach((item, index) => {
                        reportText += `#${index + 1} - ID: ${item.nmid}, Article: ${item.supplierarticle}, Total Price: ${item.totalprice}, For Pay: ${item.forpay}\n`;
                    });
                    ctx.reply(reportText);
                }
                catch (error) {
                    console.error('Ошибка при формировании отчета по топ-5 самых дорогих товарам:', error);
                    ctx.reply('Ошибка при формировании отчета по топ-5 самых дорогих товарам');
                }
                break;
            default:
            case 'Отчет по категориям':
                try {
                    const categoryReport = yield (0, reportService_1.generateCategoryReport)();
                    let reportText = 'Отчет по категориям:\n\n';
                    categoryReport.forEach((categoryItem) => {
                        reportText += `Категория: ${categoryItem.category}, Количество товаров: ${categoryItem.count}\n`;
                    });
                    ctx.reply(reportText);
                }
                catch (error) {
                    console.error('Ошибка при формировании отчета по категориям:', error);
                    ctx.reply('Ошибка при формировании отчета по категориям');
                }
                break;
                ctx.reply('Выберите опцию из списка.');
        }
    }));
    bot.launch()
        .then(() => console.log('Бот Telegram запущен'))
        .catch(err => console.error('Ошибка запуска бота Telegram:', err));
}
exports.initializeBot = initializeBot;
