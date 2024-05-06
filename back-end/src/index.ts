import express from 'express';
import http from 'http';
import { createArticle, deleteArticle, getAllArticles, getArticle, updateArticle } from "./controllers/ArticleController";
import { createOrder, deleteOrder, getAllOrder, getOrder, submitingOrder } from "./controllers/OrderController";
import { Article } from "./Article";
import { getNewDataSource } from "./config/database";
import { Order } from './Order';

const app = express();
const cors = require('cors');

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3001', 
},{
  origin: 'http://localhost:3001', 
}));

app.get('/', (req, res) => {
  res.send('Hello from the homepage!');
});

app.post('/api/article', createArticle);
app.get('/api/articles', getAllArticles);
app.get('/api/article/:id', getArticle);
app.post('/api/article/:id', updateArticle);
app.delete('/api/article/:id', deleteArticle);

app.post('/api/order', createOrder);
app.get('/api/orders', getAllOrder);
app.get('/api/order/:id', getOrder);
app.get('/api/order/:id/submit', submitingOrder);
app.delete('/api/order/:id', deleteOrder);

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
