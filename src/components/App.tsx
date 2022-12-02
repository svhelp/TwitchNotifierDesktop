import { LoginPage } from 'components/Login/LoginPage';
import { MainLayout } from 'components/Main/MainLayout';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { ErrorPage } from './Error/ErrorPage';

export default function App() {  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />} />
        <Route path="/auth" element={<LoginPage />} />
        <Route path="/error" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}
