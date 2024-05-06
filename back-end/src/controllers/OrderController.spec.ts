import request from 'supertest';
import { app } from '../index'; // Import your Express application
import { Order } from '../Order';
import { DataSource } from "typeorm";
import { Article } from '../Article';
import { getNewDataSource } from '../config/database';

let dataSource: DataSource;

beforeEach(async () => {
    dataSource = await getNewDataSource(":memory:");

    await dataSource.synchronize();
    await Article.createBaseArticles();
    await Order.createBaseOrders();
});

afterEach(async () => {
    if (dataSource.isInitialized) {
        await dataSource.dropDatabase();
        await dataSource.destroy();
    }
});
describe('Order Controller', () => {
   describe('GET /orders', () => {
    it('should return all orders', async () => {
        const articles = await Article.find();

        const orderData = [
            {
              articles: [
                { article: articles[0], quantity: 2 },
                { article: articles[1], quantity: 1 }
              ]
            },
            {
              articles: [
                { article: articles[0], quantity: 1 },
              ]
            }
          ];
        Order.find = jest.fn().mockResolvedValue(orderData); 
        
        const response = await request(app).get('/orders');
 
        expect(response.status).toBe(200);
        expect(response.body).toEqual(orderData);
    });
});

describe('GET /order/:id', () => {
    it('should return a single order if it exists', async () => {
        const mockOrder = { id: '1', total: 100 };
        Order.findOne = jest.fn().mockResolvedValue(mockOrder);

        const response = await request(app).get('/order/1');
       await console.log('Response body:', response.body); // Add this to see what is actually returned
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockOrder);
    });

    it('should return 404 if the order does not exist', async () => {
        Order.findOne = jest.fn().mockResolvedValue(null);
        const response = await request(app).get('/order/999');
        expect(response.status).toBe(404);
        expect(response.text).toContain('Commande non trouvée');
    });
});

    describe('POST /order', () => {
        it('should create an order', async () => {
            Order.createOrder = jest.fn().mockResolvedValue({});
            const orderData = { items: [{ articleId: '123', quantity: 2 }] };
            const response = await request(app).post('/order').send(orderData);
            expect(response.status).toBe(200);
            expect(response.text).toContain('Commande enregistrée');
        });
    });

    describe('DELETE /order/:id', () => {
        it('should delete an existing order', async () => {
            const mockOrder = {
                id: '1',
                deleteOrder: jest.fn().mockResolvedValue({})
            };
            Order.findOne = jest.fn().mockResolvedValue(mockOrder);
            const response = await request(app).delete('/order/1');
            expect(response.status).toBe(200);
            expect(response.text).toContain('Commande supprimé');
        });

        it('should return 404 if the order to delete does not exist', async () => {
            Order.findOne = jest.fn().mockResolvedValue(null);
            const response = await request(app).delete('/order/999');
            expect(response.status).toBe(404);
            expect(response.text).toContain('Commande non trouvée');
        });
    });

    describe('GET /order/:id/submit', () => {
        it('should submit an order', async () => {
            const mockOrder = {
                id: '1',
                submitOrder: jest.fn().mockResolvedValue({})
            };
            Order.findOne = jest.fn().mockResolvedValue(mockOrder);
            const response = await request(app).get('/order/1/submit');
            expect(response.status).toBe(200);
            expect(response.text).toContain('Commande envoyée');
        });

        it('should return 404 if the order to submit does not exist', async () => {
            Order.findOne = jest.fn().mockResolvedValue(null);
            const response = await request(app).get('/order/999/submit');
            expect(response.status).toBe(404);
            expect(response.text).toContain('Commande non trouvée');
        });
    });
});
