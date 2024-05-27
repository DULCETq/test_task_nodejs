import {Telegraf, Markup} from 'telegraf';
import {
  generateBrandReport, generateCategoryReport, generateDetailedReportForOneItem,
  generateHighestPriceReport,
  generateReport,
  generateTopExpensiveReport
} from '../services/reportService';

export function initializeBot() {
  const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN || '');

  bot.start(async (ctx) => {
    try {
      await ctx.reply('Привет! Я бот отчетов. Выберите тип отчета:', {
        reply_markup: {
          keyboard: [
            ['Общий отчет', 'Общий отчет по 1 товару', 'Отчет по категориям' ,'Отчет по бренду'],
            ['Отчет о самом дорогом товаре', 'Топ-5 самых дорогих товаров']
          ],
          one_time_keyboard: true,
          resize_keyboard: true
        }
      });
    } catch (error) {
      console.error('Ошибка при запуске бота:', error);
      ctx.reply('Ошибка при запуске бота');
    }
  });

  bot.command('stop', async (ctx) => {
    try {
      await ctx.reply('Вы завершили текущий разговор.', Markup.removeKeyboard());
    } catch (error) {
      console.error('Ошибка при завершении разговора:', error);
      ctx.reply('Ошибка при завершении разговора');
    }
  });

  bot.on('text', async (ctx) => {
    const text = ctx.message.text;
    switch (text) {
      case 'Общий отчет':
        try {
          const report = await generateReport();
          let reportText = 'Отчет:\n\n';
          report.forEach((item: any) => {
            reportText += `ID: ${item.nmid}, Article: ${item.supplierarticle}, Total Price: ${item.totalprice}, For Pay: ${item.forpay}\n`;
          });
          ctx.reply(reportText);
        } catch (error) {
          console.error('Ошибка при формировании общего отчета:', error);
          ctx.reply('Ошибка при формировании общего отчета');
        }
        break;
      case 'Общий отчет по 1 товару':
        try {
          const itemId = 84710727;
          const detailedReport = await generateDetailedReportForOneItem(itemId);
          let reportText = 'Отчет по одному товару:\n\n';
          for (const key in detailedReport) {
            reportText += `${key}: ${detailedReport[key]}\n`;
          }
          ctx.reply(reportText);
        } catch (error) {
          console.error('Ошибка при формировании общего отчета по одному товару:', error);
          ctx.reply('Ошибка при формировании общего отчета по одному товару');
        }
        break;
      case 'Отчет по бренду':
        try {
          const brandReport = await generateBrandReport();
          let reportText = 'Отчет по бренду:\n\n';
          brandReport.forEach((brandItem: any) => {
            reportText += `Бренд: ${brandItem.brand}, Количество товаров: ${brandItem.count}\n`;
          });
          ctx.reply(reportText);
        } catch (error) {
          console.error('Ошибка при формировании отчета по брендам:', error);
          ctx.reply('Ошибка при формировании отчета по брендам');
        }
        break;
      case 'Отчет о самом дорогом товаре':
        try {
          const highestPriceItem = await generateHighestPriceReport();
          if (highestPriceItem) {
            const {nmid, supplierarticle, totalprice, forpay} = highestPriceItem;
            const reportText = `Самый дорогой товар:\nID: ${nmid}, Article: ${supplierarticle}, Total Price: ${totalprice}, For Pay: ${forpay}`;
            ctx.reply(reportText);
          } else {
            ctx.reply('Отчет по самой высокой цене недоступен. Нет данных.');
          }
        } catch (error) {
          console.error('Ошибка при формировании отчета по самой высокой цене:', error);
          ctx.reply('Ошибка при формировании отчета по самой высокой цене');
        }
        break;
      case 'Топ-5 самых дорогих товаров':
        try {
          const topExpensiveItems = await generateTopExpensiveReport();
          let reportText = 'Топ-5 самых дорогих товаров:\n\n';
          topExpensiveItems.forEach((item: any, index: number) => {
            reportText += `#${index + 1} - ID: ${item.nmid}, Article: ${item.supplierarticle}, Total Price: ${item.totalprice}, For Pay: ${item.forpay}\n`;
          });
          ctx.reply(reportText);
        } catch (error) {
          console.error('Ошибка при формировании отчета по топ-5 самых дорогих товарам:', error);
          ctx.reply('Ошибка при формировании отчета по топ-5 самых дорогих товарам');
        }
        break;
      default:
      case 'Отчет по категориям':
        try {
          const categoryReport = await generateCategoryReport();
          let reportText = 'Отчет по категориям:\n\n';
          categoryReport.forEach((categoryItem: any) => {
            reportText += `Категория: ${categoryItem.category}, Количество товаров: ${categoryItem.count}\n`;
          });
          ctx.reply(reportText);
        } catch (error) {
          console.error('Ошибка при формировании отчета по категориям:', error);
          ctx.reply('Ошибка при формировании отчета по категориям');
        }
        break;

        ctx.reply('Выберите опцию из списка.');
    }
  });

  bot.launch()
    .then(() => console.log('Бот Telegram запущен'))
    .catch(err => console.error('Ошибка запуска бота Telegram:', err));
}
