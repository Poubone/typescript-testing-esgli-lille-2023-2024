import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import { sendEmail } from "./lib/email";
import { Article } from "./Article";
import { ArticleInOrder } from "./ArticleInOrder";

@Entity()
export class Order extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @OneToMany(() => ArticleInOrder, (articleInOrder) => articleInOrder.order, {
    eager: true,
  })
  articlesInOrder!: ArticleInOrder[];

  @Column({ default: false })
  submitted!: boolean;


  static async createBaseOrders(): Promise<void> {
    const articles = await Article.find();

    if (articles.length === 0) {
      console.warn("No articles found in database. Ensure base articles are created first.");
      return;
    }

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

    for (const data of orderData) {
      const order = new Order();
      await order.save();
      for (const { article, quantity } of data.articles) {
        const articleInOrder = new ArticleInOrder();
        articleInOrder.article = article;
        articleInOrder.order = order;
        articleInOrder.quantity = quantity;
        await articleInOrder.save();
      }
    }

  }

  static async createOrder(
    articlesInOrder: { articleId: string; quantity: number }[]
  ): Promise<Order> {
    for (const { articleId } of articlesInOrder) {
      const article = await Article.findOne({ where: { id: articleId } });
      if (!article) {
        throw new Error(`Article with ID ${articleId} not found.`);
      }
    }

    const order = Order.create();
    await order.save();

    for (const { articleId, quantity } of articlesInOrder) {
      const article = await Article.findOneOrFail({ where: { id: articleId } });
      const articleInOrder = ArticleInOrder.create();
      articleInOrder.order = order;
      articleInOrder.article = article;
      articleInOrder.quantity = quantity;
      await articleInOrder.save();
    }

    await order.reload();
    return order;
  }

  async submitOrder() {
    this.submitted = true;
    await this.save();
    sendEmail();
  }

  private getTotalPrice(): number {
    return this.articlesInOrder.reduce(
      (total, { article, quantity }) => total + article.priceEurCent * quantity,
      0
    );
  }

  getShippingCost(): number {
    return this.getTotalPrice() >= 10000
      ? 0
      : this.articlesInOrder.reduce(
        (total, { article, quantity }) =>
          total +
          ((article.specialShippingCostEurCent || (article.weightG * 10)) * quantity),
        0
      );
  }


  getOrderCost(): {
    totalWithoutShipping: number;
    shipping: number;
    totalWithShipping: number;
  } {
    const totalWithoutShipping = this.getTotalPrice();
    const shipping = this.getShippingCost();

    return {
      totalWithoutShipping,
      shipping,
      totalWithShipping: totalWithoutShipping + shipping,
    };
  }

  async deleteOrder() {
    await Order.delete({ id: this.id });
  }
}
