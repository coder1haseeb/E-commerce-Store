import './App.css';
import {Route , Routes} from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from 'react-router-dom';

import Home from "./Components/Home/Home"
import Login from './Components/Login&Signup/Login/Login';
import Signup from './Components/Login&Signup/Signup/Signup';
import Products from './Components/Products/Products';
import Navbar from './Components/Home/Navbar/Navbar';
import CreateProduct from './Components/Products/CreateProduct/CreateProduct';
import Show from './Components/Products/Show';
import Single_product from './Components/Products/Single_Product/Single_product';
import Cart from './Components/Products/Cart/Cart';
import AdminPanel from './Components/AdminPanel/AdminPanel';
import SingleProductCheckOut from './Components/Products/Single_Product/SingleProductCheckout/SingleProductCheckOut';
import EditProduct from './Components/AdminPanel/EditProduct/EditProduct';
import ErrorPage from './Components/Home/ErrorPage';

function App() {
  const location = useLocation();
  const hiddenPaths = ['/login', '/signup'];
  const isNavbarVisible = !hiddenPaths.includes(location.pathname);

  const token = localStorage.getItem("Token")
  const user = JSON.parse(localStorage.getItem("User"))
  return (
    <div>
      {isNavbarVisible && <Navbar />}
      
      <ToastContainer />
      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route exact path='/login' element={<Login />} />
        <Route exact path='/signup' element={<Signup />} />
        {
          user?.role == "admin" && 
          <>
            <Route exact path='/adminpanel' element={<AdminPanel />} />
            <Route exact path='/products/:slug/edit' element={<EditProduct />} />3
            <Route exact path='/create-product' element={<CreateProduct />} />
            <Route exact path='/create-checkout-session' element={<SingleProductCheckOut />} />
            <Route exact path='/products/cart' element={<Cart />} />
          </>
        }
        <Route exact path='/products' element={<Products />} />
        <Route exact path='/products/:slug' element={<Single_product />} />
        <Route exact path='/adminpanel' element={<ErrorPage />} />
      </Routes>
    </div>
  );
}

export default App;
