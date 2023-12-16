import {BrowserRouter, Routes, Route} from 'react-router-dom'
import {Index} from './pages/Index'
import {Login} from './pages/Login'
import {Tabla} from './pages/Tabla'
import {Reportes} from './pages/Reportes'
import {Administradores} from './pages/Administradores'
import {Cupos} from './pages/Cupos'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/inicio-sesion" element={<Login />} />
        <Route path="/tabla" element={<Tabla />} />
        <Route path="/reportes" element={<Reportes />} />
        <Route path="/administradores" element={<Administradores />} />
        <Route path="/cupos" element={<Cupos />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;