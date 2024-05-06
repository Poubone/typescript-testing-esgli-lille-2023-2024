import { Article } from "./Article";
import { getNewDataSource } from "./config/database";
import { createArticle, deleteArticle, getAllArticles, getArticle } from "./controllers/ArticleController";

async function main() {
  const dataSource = await getNewDataSource("./sqlite.db");
  console.log("💾 Successfully connected to database.");

  await Article.createBaseArticles();
  console.log("Successfully created articles.");

  // start HTTP server…  
  const express = require('express');
  const http = require('http');

  const app = express();

  app.use(express.json());

  app.get('/', (req: Request, res: any) => {
    res.send('Hello from the homepage!');
  });

  app.post('/article', createArticle);
  app.get('/articles', getAllArticles);
  app.get('/article/:id', getArticle);
  app.delete('/article/:id', deleteArticle);

  const server = http.createServer(app);

  server.listen(3000, () => {
    console.log('Server listening on port 3000');
  });
}

main();
