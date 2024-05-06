import { useEffect, useState } from "react";
import { sendDeleteRequest, sendGetRequest } from "../lib/http";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import AddArticles from "./AddArticles";
import EditArticle from "./EditArticle";

export default function Articles(){
    type Article = {
        id: string;
        name: string;
        priceEurCent: number;
        specialShippingCostEurCent: number;
        weightG: number;
      };
      
    const [articles, setArticles] = useState<(Article & { quantity: number })[] | null>(null);

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

  const handleDeleteArticle = async (id: string) => {
    await sendDeleteRequest("/article/" + id).then(
      window.location.reload()
    )
  }

  useEffect(() => {
    fetchArticles()
  }, []);
  
    return(
        <div className="container mt-4">
          <div className="d-flex flex-row justify-content-between align-items-center mt-4">
                <h3>Articles</h3>
                <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target={"#addArticle"}>Ajouter un article</button>
            </div>
            <AddArticles reload={fetchArticles}/>
            <hr />
            <table className="table table-striped">
              <thead>
                <tr>
                  <th scope="col">#UUID</th>
                  <th scope="col">Nom</th>
                  <th scope="col">Prix</th>
                  <th scope="col">Poids</th>
                  <th scope="col">Action</th>
                </tr>
              </thead>
              <tbody>
                {articles !== null ? 
                  articles.length > 0 ? 
                    articles.map((article, index) => 
                      <tr key={index}>
                        <th scope="row">{article.id}</th>
                        <td>{article.name}</td>
                        <td>{article.priceEurCent / 100} €</td>
                        <td>{article.weightG / 100} Kg</td>
                        <td>
                            <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target={"#update" + article.id}><FontAwesomeIcon icon={faEdit}/></button>
                            <button className="btn btn-danger ms-2" data-bs-toggle="modal" data-bs-target={"#delete" + article.id}><FontAwesomeIcon icon={faTrashCan}/></button>
                        </td>
                      </tr>
                    )
                  : "Aucun article"
                : ""}
               
              </tbody>
          </table>
          {articles !== null ? 
                  articles.length > 0 ? 
                    articles.map((article, index) => 
                      <div key={index}>
                        <EditArticle article={article} />
                        <div className="modal" id={"delete" + article.id}>
                          <div className="modal-dialog">
                            <div className="modal-content">
                              <div className="modal-header">
                                <h5 className="modal-title">Supprimer {article.name}</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                              </div>
                              <div className="modal-body">
                                <p>Êtes-vous sûr de vouloir supprimer {article.name} ?</p>
                              </div>
                              <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" id={"closedelete" + article.id} data-bs-dismiss="modal">Non</button>
                                <button type="button" className="btn btn-danger" onClick={() => handleDeleteArticle(article.id)} data-bs-dismiss="modal">Oui</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  : ""
                : ""}
        </div>
    )
}