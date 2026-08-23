import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Radis from './pages/Radis';
import MediShare from './pages/MediShare';
import Admin from './pages/Admin';
import Navigation from './components/layout/Navigation';
import Footer from './components/layout/Footer';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navigation />
        <main className="flex-grow pt-20">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/radis/*" element={<Radis />} />
            <Route path="/medishare/*" element={<MediShare />} />
            <Route path="/admin/*" element={<Admin />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
