import {BrowserRouter, Routes, Route} from 'react-router-dom'
import {Index} from './pages/Index'
import {Login} from './pages/Login'
import {Tabla} from './pages/Tabla'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/inicio-sesion" element={<Login />} />
        <Route path="/tabla" element={<Tabla />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;