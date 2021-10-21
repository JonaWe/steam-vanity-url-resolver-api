import express from 'express';

const app = express();

const PORT = process.env.PORT || 5000;

app.get('/resolve', async (req, res) => {
  const vanityUrl = req.query.vanityurl;

  if (typeof vanityUrl === 'undefined') {
    res
      .status(400)
      .send('Please provide the vanityurl parameter for this method.');
  }

  const steam64id = 1; // TODO get the id

  res.send({ steam64id });
});

app.listen(PORT, () => console.log(`Server is running at ${PORT}`));
