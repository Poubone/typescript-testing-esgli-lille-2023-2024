import express from 'express';
import http from 'http';
import { createArticle, deleteArticle, getAllArticles, getArticle } from "./controllers/ArticleController";
import { createOrder, deleteOrder, getAllOrder, getOrder, submitingOrder } from "./controllers/OrderController";
import { Article } from "./Article";
import { getNewDataSource } from "./config/database";
import { Order } from './Order';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from the homepage!');
});

app.post('/article', createArticle);
app.get('/articles', getAllArticles);
app.get('/article/:id', getArticle);
app.delete('/article/:id', deleteArticle);

app.post('/order', createOrder);
app.get('/orders', getAllOrder);
app.get('/order/:id', getOrder);
app.get('/order/:id/submit', submitingOrder);
app.delete('/order/:id', deleteOrder);

async function main() {
  const dataSource = await getNewDataSource("./sqlite.db");
  console.log("💾 Successfully connected to database.");

  await Article.createBaseArticles();
  await Order.createBaseOrders();

 

  const server = http.createServer(app);

  server.listen(0, () => {
    const address = server.address();
    const port = typeof address === "string" ? address : address?.port;
    console.log(`Server listening on port ${port}`);
});
}

main();
export { app, main };
