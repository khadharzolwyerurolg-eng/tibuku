import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Author from "./pages/Author";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Explorer from "./pages/Explorer";
import Story from "./components/Story/Story";
import Login from "./components/Users/auth/Login";
import Register from "./components/Users/auth/Register";

import Perfil from "./components/Users/Perfil/Perfil";

const router = createBrowserRouter([
  {
    path: '/',
    element:<Layout />,
    children: [
      { path: '/', element: <Home />},
      { path: '/author', element: <Author />},
      { path: '/about', element: <About />},
      { path: '/contact', element: <Contact />},
    ],
  },
  {
    path: '/explorer',
    element:<Explorer />
  },
  {
    path: '/story/:storyId',
    element: <Story />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />
  },
  {
    path: '/perfil/:userId?',
    element: <Perfil />
  }
]);

function App() {
  return (
    <div className="App">
      <div className="container">
        <RouterProvider router={router} />
      </div>
    </div>
  );
}

export default App;
