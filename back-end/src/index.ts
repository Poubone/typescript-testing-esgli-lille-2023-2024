import { Article } from "./Article";
import { getNewDataSource } from "./config/database";

async function main() {
  const dataSource = await getNewDataSource("./sqlite.db");
  console.log("💾 Successfully connected to database.");

  await Article.createBaseArticles();
  console.log("Successfully created articles.");

  // start HTTP server…
  const http = require('http');

  const server = http.createServer((req: Request, res: any) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello from Node.js!');
  });

  server.listen(3000, () => {
    console.log('Server listening on port 3000');
  });
  
}

main();
