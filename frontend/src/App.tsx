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
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/radis/*" element={<div className="pt-20"><Radis /></div>} />
            <Route path="/medishare/*" element={<div className="pt-20"><MediShare /></div>} />
            <Route path="/admin/*" element={<div className="pt-20"><Admin /></div>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
