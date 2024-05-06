import { useEffect, useState } from "react";
import { sendGetRequest } from "../lib/http";
import { useParams } from 'react-router-dom';

export default function SinglePurchase(){
    const [order, setOrder] = useState([]);
    const { id } = useParams();

  const fetchOrders = async () => {
    const ods: any  = await sendGetRequest("/order/" + id);
    if(ods !== undefined){
        setOrder(ods);
    }
  };

  useEffect(() => {
    fetchOrders()
  }, []);
  useEffect(() => {
    console.log(order)
  }, [order]);

    return(
        <div className="container">
            {order !== null ? 
                <div className="mt-3">
                    <span>Envoyé le : {order.createdAt}</span><br />
                    <span>Elements de la commande :</span>
                    <ul>
                        {order.articlesInOrder !== undefined ? 
                            order.articlesInOrder.map(article => 
                                <li>
                                    <ul>
                                        <li>ID : {article.id}</li>
                                        <li>Quantity : {article.quantity}</li>
                                    </ul>
                                </li>
                                )
                            :""
                        }
                        
                    </ul>
                </div>
            : ""}
        </div>
    )
}