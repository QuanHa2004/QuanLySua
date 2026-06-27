import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import { CartProvider } from './context/cart-context.js';
import AppRoutes from './routes/app-routes';
import './styles/index.css';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <CartProvider>
    <BrowserRouter>
      <AppRoutes/>
    </BrowserRouter>
  </CartProvider>
);
