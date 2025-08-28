const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Swap DEX is running!');
});

app.listen(port, () => {
  console.log(`Swap DEX app listening at http://localhost:${port}`);
});
