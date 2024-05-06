import { useEffect, useState } from "react";
import { sendGetRequest } from "../lib/http";
import { Link } from "react-router-dom";

export default function Purchases(){
    const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const ods: any  = await sendGetRequest("/orders");
    if(ods !== undefined){
        setOrders(ods);
    }
  };

  const submitPurchase = async (id) => {
    await sendGetRequest('/order/' + id + "/submit").then(window.location.reload())
  }

  useEffect(() => {
    fetchOrders()
  }, []);

    return(
        <div className="container">
             <div className="d-flex flex-row justify-content-between align-items-center mt-4">
                <h3>Commandes</h3>
            </div>
            <hr />
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">#UUID</th>
                  <th >Date</th>
                  <th >Action</th>
                </tr>
              </thead>
              <tbody>
                {orders !== null ? 
                  orders.length > 0 ? 
                  orders.map((order, index) => 
                      <tr key={index}>
                        <th scope="row"><Link to={"/purchase/" + order.id}>{order.id}</Link></th>
                        <th>{order.createdAt}</th>
                        <th>{order.submitted ? "Envoyée" : <button className="btn btn-primary" onClick={() => submitPurchase(order.id)}>Envoyer</button>}</th>
                      </tr>
                    )
                  : "Aucun article"
                : ""}
               
              </tbody>
          </table>
        </div>
    )
}