import express from "express";
import qs from "qs";
import checkIn from "./http-handlers/check-in";

const app = express();
const port = 4000;

app.set("query parameter", (str: string) => {
  qs.parse(str);
})

app.get('/', (req, res) => {
  res.send('Hello World!');
})

app.get('/check-in', (req, res) => {
  let direction = checkIn(req.query);
  res.json({ direction });
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
