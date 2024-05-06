import { useState } from "react"
import { sendPostRequest } from "../lib/http"

export default function EditArticle({article}){
    const [price, setPrice] = useState(article.priceEurCent)
    const [name, setName] = useState(article.name)
    const [weight, setWeight] = useState(article.weightG)
    const [ship, setChip] = useState(article.specialShippingCostEurCent)

    const handleSubmit = async () => {
        const data = {
            name,
            priceEurCent: price,
            specialShippingCostEurCent: ship,
            weightG: weight
        }
        await sendPostRequest("/article/" + article.id, data).then(
            window.location.reload()
        )
    }

    return (
        <div className="modal" id={"update" + article.id}>
            <div className="modal-dialog">
            <div className="modal-content">
                <div className="modal-header">
                <h5 className="modal-title">Mettre a jour {article.name}</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                <div>
                        <label htmlFor="name" className="form-label">Nom de l'article</label>
                        <input type="email" defaultValue={article.name} className="form-control" onChange={(e) => setName(e.target.value)} id="name" />
                    </div>
                    <div>
                        <label htmlFor="price" className="form-label">Prix en euro</label>
                        <input type="number" defaultValue={article.priceEurCent / 100} className="form-control" onChange={(e) => setPrice(parseInt(e.target.value) * 100)} id="price" />
                    </div>
                    <div>
                        <label htmlFor="weight" className="form-label">Poids en kg</label>
                        <input type="number" defaultValue={article.weightG / 100} className="form-control" onChange={(e) => setWeight(parseInt(e.target.value) * 100)} id="weight" />
                    </div>
                    <div>
                        <label htmlFor="frais" className="form-label">Frais d'envoie (optionnel)</label>
                        <input type="number" defaultValue={article.specialShippingCostEurCent / 100} className="form-control" onChange={(e) => setChip(parseInt(e.target.value) * 100)} id="frais" />
                    </div>
                </div>
                <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleSubmit}>Save changes</button>
                </div>
            </div>
            </div>
        </div>
    )
}