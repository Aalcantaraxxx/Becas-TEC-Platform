import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PersonalizationPage from './pages/PersonalizationPage';
import ImpactPage from './pages/ImpactPage'; 
import CheckoutPage from './pages/CheckoutPage'; 
import ThankYouPage from './pages/ThankYouPage';
import AccountPage from './pages/AccountPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';

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
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;