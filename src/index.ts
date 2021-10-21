import express from 'express';
import dotenv from 'dotenv';
import axios from 'axios';
import rateLimit from 'express-rate-limit';

// loading the .env file for development
dotenv.config();

const STEAM_API_KEY = process.env.STEAM_API_KEY;
const baseURL = `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001?key=${STEAM_API_KEY}`;

const app = express();

const PORT = process.env.PORT || 5000;

// Setting the rate limit
const rateLimiter = rateLimit({
  windowMs: 5 * 50 * 1000, // 5 minutes
  max: 25,
});

app.use(rateLimiter);
app.set('trust proxy', 1);

app.get('/resolve', async (req, res) => {
  const vanityUrl = req.query.vanityurl;

  if (typeof vanityUrl === 'undefined') {
    res
      .status(400)
      .send('Please provide the vanityurl parameter for this method.');
  }

  const requestURL = `${baseURL}&vanityurl=${vanityUrl}`;

  try {
    const response = await axios.get(requestURL);
    const { success, steamid, message } = (response.data as Response).response;

    if (success === 42) {
      return res.status(400).send(message);
    }

    res.send({ steam64id: steamid });
  } catch (error) {
    res.status(500).send('Internal Error');
    console.error(error);
  }
});

app.listen(PORT, () => console.log(`Server is running at ${PORT}`));

interface Response {
  response: {
    success: 1 | 42;
    steamid?: string;
    message?: string;
  };
}
