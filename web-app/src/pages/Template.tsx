import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, Outlet, useLocation } from "react-router-dom";

export default function Template(){
    const location = useLocation();
    return(
        <div className="">
            <nav className="navbar navbar-expand-lg navbar-light bg-light p-2">
                <a className="navbar-brand" href="#">Projet NodeJS</a>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse d-flex flex-row justify-content-between align-items-center" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className={location.pathname === "/" ? "nav-item text-primary" : "nav-item"}>
                            <Link className="nav-link" to="/">Articles</Link>
                        </li>
                        <li className={location.pathname === "/purchases" ? "nav-item text-primary" : "nav-item"}>
                            <Link className="nav-link" to="/purchases">Vos commandes</Link>
                        </li>
                        <li className={location.pathname === "/articles" ? "nav-item text-primary" : "nav-item"}>
                        <Link className="nav-link" to="/articles">Admin articles</Link>
                        </li>
                    </ul>
                    <div className="d-flex flex-row justify-content-between align-items-center">
                        <span data-bs-toggle="modal" data-bs-target={"#cart"} className="me-3 c-pointer"><FontAwesomeIcon icon={faCartShopping} size="lg" /></span>
                    </div>
                </div>  
            </nav>
            <Outlet/>
        </div>
    )
}