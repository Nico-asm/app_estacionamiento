import React, { useState, useEffect } from "react";
import axios from "axios";

// Utilidad para manejar redirecciones por token inválido
function handleInvalidToken(error) {
  if (error.response && error.response.status === 401) {
    console.error(
      "Token inválido. Redirigiendo a la página de inicio de sesión..."
    );
    // Redirige a la página de inicio de sesión 
    window.location.href = "/inicio-sesion";
  } else {
    console.error("Error:", error.response?.data || error.message);
  }
}

export function Reportes() {
  const [reportes, setReportes] = useState([]);
  // Recuperar tokens desde el localStorage
  const accessToken = localStorage.getItem("accessToken");

  const headers = React.useMemo(() => ({
    Authorization: `Bearer ${accessToken}`,
  }), [accessToken]);

  useEffect(() => {
    // Realiza la llamada a la API para obtener los reportes
    const fetchReportes = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/reportes/",
          { headers }
        );
        

        setReportes(response.data);
      } catch (error) {
        handleInvalidToken(error, history);
        console.error(
          "Error al obtener la lista de reportes:",
          error.response?.data || error.message
        );
      }
    };

    fetchReportes();
  }, [headers ]);

  return (
    <div>
      <div className="navbar">
        <a href="/tabla" className="btn-navbar">
          Volver a la tabla
          <img
            src="https://portales.inacap.cl/web_resources/themes/portal/img/logoFooter.png"
            alt="Logo A Inacap"
          />
        </a>
      </div>
      <h1>Lista de Reportes</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Descripción</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {reportes.map((reporte) => (
            <tr key={reporte.id}>
              <td>{reporte.id}</td>
              <td>{reporte.rep_titulo}</td>
              <td>{reporte.rep_descripcion}</td>
              <td>{new Date(reporte.rep_fecha).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Reportes;
