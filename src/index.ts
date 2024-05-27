import express from 'express';
import dotenv from 'dotenv';
import { fetchAndStoreWildberriesData } from './services/wildberriesService';
import { initializeBot } from './bot/telegramBot';

dotenv.config();

const app = express();

app.use(express.json());

app.get('/fetch-data', async (req, res) => {
  try {
    await fetchAndStoreWildberriesData();
    res.status(200).send('Data fetched and stored successfully');
  } catch (error) {
    console.error('Error fetching and storing data:', error);
    res.status(500).send('Error fetching and storing data');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  initializeBot();
});
