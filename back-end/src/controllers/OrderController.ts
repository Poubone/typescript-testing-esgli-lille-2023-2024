import { EqualOperator, FindOneOptions, IsNull } from "typeorm";
import { ArticleInOrder } from "../ArticleInOrder";
import { Order } from "../Order";

export const getAllOrder = async (req: Request, res: any) => {
    const order = await Order.find()
    res.send(JSON.stringify(order))
};

export const getOrder = async (req: Request, res: any) => {
    const order = await Order.findOne({where : {id : req.params.id}})
    if(order !== null){
        res.send(JSON.stringify(order))
    } else {
        res.status(404).send("Commande non trouvée")
    }
};

export const submitingOrder = async (req: Request, res: any) => {
    const order = await Order.findOne({where : {id : req.params.id}})
    if(order !== null){
        await order.submitOrder()
        res.status(200).send("Commande envoyée")
    } else {
        res.status(404).send("Commande non trouvée")
    }
};

export const createOrder = async (req: Request, res: any) => {
    if(req.body !== null && req.body !== undefined){
        Order.createOrder(req.body).then(
            res.status(200).send("Commande enregistrée")
        )
    }
};


export const deleteOrder = async (req: Request, res: any) => {
    const order = await Order.findOne({where : {id : req.params.id}})
    if(order !== null){
        await order.deleteOrder().then(
            res.status(200).send("Commande supprimé")
        )
    } else {
        res.status(404).send("Commande non trouvée")
    }  
};