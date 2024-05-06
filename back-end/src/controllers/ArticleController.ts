import { Article } from "../Article";

interface ArticlePost {
    name: string;
    priceEur : number;
    weightKg: number;
    specialShippingCost: number;
  }

export const createArticle = async (req: Request, res: any) => {
    if(req.body !== null && req.body !== undefined){
        const data: ArticlePost = req.body
        const article = new Article
        article.name = data.name;
        article.priceEur = data.priceEur
        article.weightKg = data.weightKg
        if(data.specialShippingCost){
            article.specialShippingCost = data.specialShippingCost
        }
        article.save();
        res.send("Article enregistrés").status(200)
    }
};

export const getAllArticles = async (req: Request, res: any) => {
    const articles = await Article.find()
    res.send(JSON.stringify(articles))
};

export const getArticle = async (req: Request, res: any) => {
    const article = await Article.findOne({where : {id : req.params.id}})
    if(article !== null){
        res.send(JSON.stringify(article))
    } else {
        res.status(404).send("Article non trouvée")
    }
};

export const deleteArticle = async (req: Request, res: any) => {
    const article = await Article.findOne({where : {id : req.params.id}})
    if(article !== null){
        await Article.remove(article).then(
            res.status(200).send("Article supprimé")
        )
    } else {
        res.status(404).send("Article non trouvée")
    }  
};