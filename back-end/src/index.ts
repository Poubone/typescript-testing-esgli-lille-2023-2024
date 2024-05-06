import { Article } from "./Article";
import { getNewDataSource } from "./config/database";

async function main() {
  const dataSource = await getNewDataSource("./sqlite.db");
  console.log("💾 Successfully connected to database.");

  await Article.createBaseArticles();
  console.log("Successfully created articles.");

  // start HTTP server…  
  const express = require('express');
  const http = require('http');

  const app = express();

  app.get('/', (req: Request, res: any) => {
    res.send('Hello from the homepage!');
  });

  app.get('/users', (req: Request, res: any) => {
    res.send('This is the users route!');
  });

  const server = http.createServer(app);

  server.listen(3000, () => {
    console.log('Server listening on port 3000');
  });
}

main();
