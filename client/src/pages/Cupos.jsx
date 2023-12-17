import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "react-modal";
import "./ModalCupos.css";

Modal.setAppElement("#root");

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

export function Cupos() {
  const [cuposInfo, setCuposInfo] = useState({
    cupo_funcionarios: 0,
    cupo_estudiantes: 0,
    cupo_visitas: 0,
  });

  // Recuperar tokens desde el localStorage
  const accessToken = localStorage.getItem("accessToken");

  const headers = {
    Authorization: `Bearer ${accessToken}`,
  };

  const [nuevaConfiguracion, setNuevaConfiguracion] = useState({
    nuevoCupoFuncionarios: 0,
    nuevoCupoEstudiantes: 0,
    nuevoCupoVisitas: 0,
  });
  const [configModalIsOpen, setConfigModalIsOpen] = useState(false);
  const [tempNuevaConfiguracion, setTempNuevaConfiguracion] = useState({
    nuevoCupoFuncionarios: 0,
    nuevoCupoEstudiantes: 0,
    nuevoCupoVisitas: 0,
  });
  const fetchCuposInfo = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/cupos-estacionamiento/",
        { headers }
      );
      setCuposInfo(response.data);

      // Si hay información de configuración disponible, establece el configuracionId
      if (response.data.configuracion_id) {
        setConfiguracionId(response.data.configuracion_id);
      }
    } catch (error) {
      handleInvalidToken(error, history);
      console.error(
        "Error al obtener la información de los cupos:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    fetchCuposInfo();
  }, []);

  const handleCrearCupos = async () => {
    try {
      // Realizar la solicitud HTTP para crear nuevos cupos
      await axios.post(
        "http://127.0.0.1:8000/api/cupos-estacionamiento/",
        {},
        { headers }
      );
      // Actualizar la información de los cupos después de la creación
      fetchCuposInfo();
      console.log("Nuevos cupos creados con éxito");
    } catch (error) {
      handleInvalidToken(error, history);
      console.error(
        "Error al crear nuevos cupos:",
        error.response?.data || error.message
      );
    }
  };
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
      <h1>Cupos Disponibles</h1>
      <table>
        <thead>
          <tr>
            <th>Tipo de Usuario</th>
            <th>Cupos Disponibles</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Funcionarios</td>
            <td>{cuposInfo.cupo_funcionarios}</td>
          </tr>
          <tr>
            <td>Estudiantes</td>
            <td>{cuposInfo.cupo_estudiantes}</td>
          </tr>
          <tr>
            <td>Visitas</td>
            <td>{cuposInfo.cupo_visitas}</td>
          </tr>
        </tbody>
      </table>
      <button onClick={handleCrearCupos}>Crear Nuevos Cupos</button>
      &nbsp;
    </div>
  );
}

export default Cupos;
