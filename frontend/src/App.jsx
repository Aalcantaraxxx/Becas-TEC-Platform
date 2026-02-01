import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PersonalizationPage from './pages/PersonalizationPage';
import ImpactPage from './pages/ImpactPage'; 
import CheckoutPage from './pages/CheckoutPage'; 
import ThankYouPage from './pages/ThankYouPage';
import AccountPage from './pages/AccountPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/personalizar/:institution" element={<PersonalizationPage />} />
        
        <Route path="/impacto-transparencia" element={<ImpactPage />} />
        
        <Route path="/checkout" element={<CheckoutPage />} />

        <Route path="/thank-you" element={<ThankYouPage />} />

        <Route path="/account" element={<AccountPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;