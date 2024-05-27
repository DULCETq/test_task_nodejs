import axios from 'axios';
import { z, ZodError } from 'zod';

export const itemSchema = z.object({
  date: z.string(),
  lastChangeDate: z.string(),
  warehouseName: z.string(),
  countryName: z.string(),
  oblastOkrugName: z.string(),
  regionName: z.string(),
  supplierArticle: z.string(),
  nmId: z.number(),
  barcode: z.string(),
  category: z.string(),
  subject: z.string(),
  brand: z.string(),
  techSize: z.string(),
  incomeID: z.number(),
  isSupply: z.boolean(),
  isRealization: z.boolean(),
  totalPrice: z.number(),
  discountPercent: z.number(),
  spp: z.number(),
  forPay: z.number(),
  finishedPrice: z.number(),
  priceWithDisc: z.number(),
  saleID: z.string(),
  orderType: z.string(),
  sticker: z.string().optional(),
  gNumber: z.string(),
  srid: z.string()
});

export type Item = z.infer<typeof itemSchema>; // Export the Item type

const fetchData = async () => {
  try {
    const wildberriesApiUrl = 'https://statistics-api-sandbox.wildberries.ru/api/v1/supplier/sales?dateFrom=2019-06-20';
    const wildberriesApiToken = 'eyJhbGciOiJFUzI1NiIsImtpZCI6IjIwMjQwNTA2djEiLCJ0eXAiOiJKV1QifQ.eyJlbnQiOjEsImV4cCI6MTczMjE2MjYzNiwiaWQiOiJiMjdkZGYzYi1mZjFjLTQ0NzEtYjQ4Yy0xOGExNTBhZWU2Y2EiLCJpaWQiOjQ2OTkyNzAsIm9pZCI6MTg0MDIsInMiOjAsInNpZCI6ImYyMzI3ZjVkLTViMDEtNWQ1MC05NjI5LTkyMTgwOTkzZDUxNCIsInQiOnRydWUsInVpZCI6NDY5OTI3MH0.Rx8HMupyWGYXhoIoqUffQKPRJKTW7-FrFljvgOk7SRfnGG82PLCLEEFhUcQHaskZir_k0nESgUwCQOHj2VZ77w';

    if (!wildberriesApiUrl || !wildberriesApiToken) {
      console.error('WILDBERRIES_API_URL or WILDBERRIES_API_TOKEN is not set');
      return;
    }

    const response = await axios.get<Item[]>(wildberriesApiUrl, {
      headers: {
        Authorization: `Bearer ${wildberriesApiToken}`,
        'Accept': 'application/json'
      },
    });

    const data = response.data;

    console.log('Полученные данные:', data);

    data.forEach((item: Item) => {
      try {
        const parsedItem = itemSchema.parse(item);
        console.log('Успешно проверено:', parsedItem);
      } catch (validationError) {
        if (validationError instanceof ZodError) {
          console.error('Ошибка валидации:', validationError.errors);
        } else {
          console.error('Неизвестная ошибка валидации:', validationError);
        }
        console.log('Проблемный элемент:', item);
      }
    });
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error('Ошибка ответа сервера:', error.response?.data);
    } else {
      console.error('Ошибка запроса:', error instanceof Error ? error.message : 'Unknown error');
    }
  }
};

fetchData();
