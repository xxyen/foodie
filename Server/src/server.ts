import express from "express";
const app = express();
const port = 4000;

app.get('/', (req, res) => {
  res.send('Hello from Foodie server!');
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
