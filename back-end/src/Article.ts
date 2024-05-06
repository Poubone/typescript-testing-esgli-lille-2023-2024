import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ArticleInOrder } from "./ArticleInOrder";

const BASE_ARTICLES = [
  {
    name: "Câble HDMI",
    priceEurCent: 2000, // Conversion de 20 EUR à 2000 cents
    weightG: 100, // Conversion de 0.1 kg à 100 g
  },
  {
    name: "Cuisse de poulet",
    priceEurCent: 1000, // Conversion de 10 EUR à 1000 cents
    weightG: 150, // Conversion de 0.15 kg à 150 g
    specialShippingCostEurCent: 400, // Conversion de 4 EUR à 400 cents
  },
];

@Entity()
export class Article extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  name!: string;

  @Column({ type: "integer" })
  priceEurCent!: number;

  @Column({ type: "integer" })
  weightG!: number;

  @Column({ type: "integer", nullable: true })
  specialShippingCostEurCent!: number | null;

  @OneToMany(() => ArticleInOrder, (articleInOrder) => articleInOrder.article)
  ordersWithArticle!: ArticleInOrder[];

  static async createBaseArticles() {
    for (const baseArticle of BASE_ARTICLES) {
      const article = new Article();
      article.name = baseArticle.name;
      article.priceEurCent = baseArticle.priceEurCent;
      article.weightG = baseArticle.weightG;
      article.specialShippingCostEurCent = baseArticle.specialShippingCostEurCent ?? null;

      // TODO: do not insert if article with name already exists
      await article.save();
    }
  }
}
