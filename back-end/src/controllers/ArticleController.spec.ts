import request from 'supertest';
import{app} from '../index';  
import { Article } from '../Article'; 
import { DataSource } from 'typeorm';
import { getNewDataSource } from '../config/database';

//jest.mock('../Article');  // Mock the Article entity
let dataSource: DataSource;
beforeEach(async () => {
    dataSource = await getNewDataSource(":memory:");

    await dataSource.synchronize();
    await Article.createBaseArticles();
   // await Order.createBaseOrders();
});

afterEach(async () => {
    if (dataSource.isInitialized) {
        await dataSource.dropDatabase();
        await dataSource.destroy();
    }
});
describe('Article Controller', () => {
    
  describe('POST /article', () => {
    it('should create an article and return confirmation', async () => {
      const articleData = {
        name: "Example Article",
        priceEurCent: 1000,
        weightG: 500,
        specialShippingCostEurCent: 100
      };
      Article.prototype.save = jest.fn().mockResolvedValue(articleData);

      const response = await request(app)
        .post('/article')
        .send(articleData);

      expect(response.status).toBe(200);
      expect(response.text).toBe("Article enregistrés");
    });
  });

  describe('GET /articles', () => {
    it('should return all articles', async () => {
      const mockArticles = [
        { name: "Example Article 1", priceEurCent: 1000, weightG: 500 },
        { name: "Example Article 2", priceEurCent: 2000, weightG: 1000 }
      ];
      Article.find = jest.fn().mockResolvedValue(mockArticles);

      const response = await request(app).get('/articles');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockArticles);
    });
  });

  describe('GET /article/:id', () => {
    it('should return a specific article', async () => {
      const mockArticle = { id: '1', name: "Example Article", priceEurCent: 1000, weightG: 500 };
      Article.findOne = jest.fn().mockResolvedValue(mockArticle);

      const response = await request(app).get('/article/1');
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockArticle);
    });

    it('should return 404 if the article does not exist', async () => {
      Article.findOne = jest.fn().mockResolvedValue(null);
      const response = await request(app).get('/article/999');
      expect(response.status).toBe(404);
      expect(response.text).toBe("Article non trouvée");
    });
  });

  describe('DELETE /article/:id', () => {
    it('should delete an article and return a confirmation', async () => {
      const mockArticle = { id: '1', name: "Example Article", priceEurCent: 1000, weightG: 500, remove: jest.fn().mockResolvedValue(undefined) };
      Article.findOne = jest.fn().mockResolvedValue(mockArticle);
      Article.remove = jest.fn().mockResolvedValue(mockArticle);

      const response = await request(app).delete('/article/1');
      expect(response.status).toBe(200);
      expect(response.text).toBe("Article supprimé");
    });

    it('should return 404 if the article to delete does not exist', async () => {
      Article.findOne = jest.fn().mockResolvedValue(null);
      const response = await request(app).delete('/article/999');
      expect(response.status).toBe(404);
      expect(response.text).toBe("Article non trouvée");
    });
  });
});
