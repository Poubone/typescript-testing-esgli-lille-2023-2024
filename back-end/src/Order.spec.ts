import { DataSource } from "typeorm";
import { Order } from "./Order";
import { sendEmail } from "./lib/email";
import { getNewDataSource } from "./config/database";
import { Article } from "./Article";
import { ArticleInOrder } from "./ArticleInOrder";

jest.mock("./lib/email");

let dataSource: DataSource;

beforeEach(async () => {
  dataSource = await getNewDataSource(":memory:");
  await Article.createBaseArticles();
});

afterEach(async () => {
  await dataSource.destroy();
});

describe("static createOrder", () => {
  describe("when all article IDs belong to articles in table", () => {
    it("returns new Order with articles", async () => {
      const articles = await Article.find();

      const order = await Order.createOrder([
        { articleId: articles[0].id, quantity: 4 },
        { articleId: articles[1].id, quantity: 1 },
      ]);

      expect(order.articlesInOrder).toMatchObject([
        {
          article: {
            name: "Câble HDMI",
            priceEurCent: 2000, 
            weightG: 100,       
          },
          quantity: 4,
        },
        {
          article: {
            name: "Cuisse de poulet",
            priceEurCent: 1000,             
            weightG: 150,                  
            specialShippingCostEurCent: 400,
          },
          quantity: 1,
        },
      ]);
    });

    it("creates order and articles in order in database", async () => {
      const articles = await Article.find();

      await Order.createOrder([
        { articleId: articles[0].id, quantity: 4 },
        { articleId: articles[1].id, quantity: 1 },
      ]);

      const orders = await Order.find();
      expect(orders).toHaveLength(1);

      const articlesInOrder = await ArticleInOrder.find();
      expect(articlesInOrder).toHaveLength(2);

      expect(articlesInOrder).toMatchObject([
        {
          article: {
            name: "Câble HDMI",
            priceEurCent: 2000, 
            weightG: 100,     
          },
          quantity: 4,
        },
        {
          article: {
            name: "Cuisse de poulet",
            priceEurCent: 1000,             
            weightG: 150,                  
            specialShippingCostEurCent: 400, 
          },
          quantity: 1,
        },
      ]);
    });
  });

  describe("when one article ID does not belong to article in table", () => {
    it("throws error", async () => {
      await expect(
        Order.createOrder([{ articleId: "0000", quantity: 1 }])
      ).rejects.toThrow("Article with ID 0000 not found.");
    });
  });
});

describe("submitOrder", () => {
  it("sets `submitted` to true", async () => {
    const order = await Order.createOrder([]);

    await order.submitOrder();

    expect(order.submitted).toEqual(true);
    expect(
      (await Order.findOne({ where: { id: order.id } }))?.submitted
    ).toEqual(true);
  });

  it("calls function `sendEmail`", async () => {
    const order = await Order.createOrder([]);

    await order.submitOrder();

    expect(sendEmail).toHaveBeenCalledTimes(1);
  });
});

describe("getShippingCost", () => {
  describe("if total article price greater than or equal to 10000 cents", () => {
    it("returns 0", async () => {
      const articles = await Article.find();
      const order = await Order.createOrder([
        { articleId: articles[0].id, quantity: 50 }, 
      ]);

      expect(order.getShippingCost()).toEqual(0);
    });
  });

  describe("if total article price less than 10000 cents", () => {
    it("returns calculated shipping cost based on new metrics", async () => {
      const articles = await Article.find();
      const order = await Order.createOrder([
        { articleId: articles[0].id, quantity: 2 },
        { articleId: articles[1].id, quantity: 3 },
      ]);
      const expectedShipping = 2 * (articles[0]?.weightG || 0) * 10 + 3 * (articles[1]?.specialShippingCostEurCent || 0);
      expect(order.getShippingCost()).toEqual(expectedShipping);
    });
  });
});

describe("getOrderCost", () => {
  it("returns total with and without shipping, and shipping", async () => {
    const articles = await Article.find();
    const order = await Order.createOrder([
      { articleId: articles[0].id, quantity: 2 },
      { articleId: articles[1].id, quantity: 3 },
    ]);

    const totalWithoutShipping = 2 * (articles[0]?.priceEurCent || 0) + 3 * (articles[1]?.priceEurCent || 0);
    const shipping = 2 * (articles[0]?.weightG || 0) * 10 + 3 * (articles[1]?.specialShippingCostEurCent || 0);
    const totalWithShipping = totalWithoutShipping + shipping;

    expect(order.getOrderCost()).toEqual({
      totalWithoutShipping,
      shipping,
      totalWithShipping,
    });
  });
});