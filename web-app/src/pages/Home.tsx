import { useEffect, useState } from "react";
import { sendGetRequest, sendPostRequest } from "../lib/http";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export default function Home(){
    type Article = {
        id: string;
        name: string;
        priceEurCent: number;
        specialShippingCostEurCent: number;
        weightG: number;
      };
    const [cartItems, setCartItems] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);
    const [cartTotalWeight, setCartTotalWeight] = useState(0);
    const [cartTotalQuantity, setCartTotalQuantity] = useState(0);
    const [articles, setArticles] = useState<(Article & { quantity: number })[] | null>(null);
    const navigate = useNavigate();

  const fetchArticles = async () => {
    const arts: any  = await sendGetRequest("/articles");
    if(arts !== undefined){
        setArticles(
            (arts as Article[]).map((article) => ({
              ...article,
              quantity: 0,
            }))
          );
    }
  };

  function handleItemAdd(item: Object) {
    const existingItem = cartItems.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCartItems(cartItems.map((cartItem: any) => {
        if (cartItem.id === item.id) {
          return { ...cartItem, quantity: cartItem.quantity + 1 };
        }
        return cartItem;
      }));
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
  }

  const calculateCartTotal = () => {
    let total = 0;
    for (const item of cartItems) {
      const price = item.priceEurCent;
      total += price * item.quantity;
    }
    return total;
  };

  const calculateCartTotalQuantity = () => {
    let total = 0;
    for (const item of cartItems) {
      total += item.quantity;
    }
    return total;
  };

  const calculateCartTotalWeight = () => {
    let total = 0;
    for (const item of cartItems) {
      const weight = item.weightG;
      total += weight * item.quantity;
    }
    return total;
  };

//   const setArticleQuantity = (id: string, quantity: number) => {
//     if (articles) {
//       setArticles(
//         articles?.map((article) =>
//           article.id === id ? { ...article, quantity } : article
//         )
//       );
//     }
//   };

const submitPurchase = async () => {
    await sendPostRequest('/order', {data: cartItems}).then(window.location.href = "/purchases")
    
    
}

  useEffect(() => {
    console.log(cartItems)
    setCartTotal(calculateCartTotal());
    setCartTotalWeight(calculateCartTotalWeight());
    setCartTotalQuantity(calculateCartTotalQuantity());
  }, [cartItems]);
  
  useEffect(() => {
    fetchArticles()
  }, []);

    return(
        <div className="container">
            <div className="d-flex flex-row justify-content-between align-items-center mt-4 flex-wrap">
                {articles !== null ?
                    articles.length > 0 ? 
                        articles.map(article => 
                            <div className="card mb-3" style={{width: 250, height: 300}}>
                                <div className="card-body d-flex flex-column justify-content-between">
                                    <div>
                                        <h5 className="card-title">{article.name}</h5>
                                        <h6 className="card-subtitle mb-2 text-muted">{article.priceEurCent} €</h6>
                                        <p className="card-text">Poids : {article.weightG} Kgs</p>
                                        <p className="card-text">Frais d'envoie supplémentaires :  {article.specialShippingCostEurCent !== null ? article.specialShippingCostEurCent + " Kgs" : "Aucun frais supplémentaires"}</p>
                                    </div>
                                    <button className="btn btn-primary" onClick={() => handleItemAdd(article)}>Ajouter au panier</button>
                                </div>
                            </div>
                        )
                    : "Aucun articles"
                : "" }
                
            </div>
            <div className="modal modal-lg" id={"cart"}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Panier</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                <th scope="col">Nom</th>
                                <th scope="col">Prix</th>
                                <th scope="col">Poids</th>
                                <th scope="col">Quantité</th>
                                </tr>
                            </thead>
                                {cartItems !== null ? 
                                cartItems.length > 0 ? 
                                <tbody>
                                    {cartItems.map((article, index) => 
                                        <tr key={index}>
                                            <td>{article.name}</td>
                                            <td>{article.priceEurCent / 100} €</td>
                                            <td>{article.weightG / 100} Kg</td>
                                            <td>{article.quantity}</td>
                                        </tr>
                                    )}
                                        <tr>
                                            <td>Total</td>
                                            <td>{cartTotal / 100} €</td>
                                            <td>{cartTotalWeight / 100} Kg</td>
                                            <td>{cartTotalQuantity} articles</td>
                                        </tr>
                                    </tbody>
                                : "Aucun article"
                                : ""}
                                
                        </table>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary"  data-bs-dismiss="modal">Retour</button>
                            <button type="button" className="btn btn-primary"  data-bs-dismiss="modal" onClick={submitPurchase}>Passer la commande</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}