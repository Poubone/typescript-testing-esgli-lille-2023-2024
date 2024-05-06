import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Template from "./pages/Template";
import Articles from "./pages/Articles";
import Purchases from "./pages/Purchases";
import SinglePurchase from "./pages/SinglePurchase";

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Template/>,
      children: [
        {
          index: true,
          element: <Home />,
        },
    ],
    },
    {
      path: "/articles",
      element: <Template/>,
      children: [
        {
          index: true,
          element: <Articles />,
        },
    ],
    },
    {
      path: "/purchases",
      element: <Template/>,
      children: [
        {
          index: true,
          element: <Purchases />,
        },
    ],
    },
    {
      path: "/purchase/:id",
      element: <Template/>,
      children: [
        {
          index: true,
          element: <SinglePurchase />,
        },
    ],
    }
  ]);

  return <RouterProvider router={router}/>
}

export default App;
