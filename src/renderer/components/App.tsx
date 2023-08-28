import { LoginPage } from './Login/LoginPage';
import { MainLayout } from './Main/MainLayout';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorPage } from './Error/ErrorPage';

export default function App() {  
  return (
    <Router>
      <Routes>
        <Route index element={<LoginPage />} />
        <Route path="/index" element={<MainLayout />} />
        <Route path="/error" element={<ErrorPage />} />
      </Routes>
    </Router>
  );
}
