import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import './ModalCupos.css';
Modal.setAppElement('#root');

export function Cupos() {
  const [cuposInfo, setCuposInfo] = useState({
    cupo_funcionarios: 0,
    cupo_estudiantes: 0,
    cupo_visitas: 0,
  });

  // Recuperar tokens desde el localStorage
  const accessToken = localStorage.getItem('accessToken');

  const headers = {
    'Authorization': `Bearer ${accessToken}`,
  };

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [nuevosCupos, setNuevosCupos] = useState({
    nuevoCupoFuncionarios: 0,
    nuevoCupoEstudiantes: 0,
    nuevoCupoVisitas: 0,
  });

  const handleModalClose = () => {
    setModalIsOpen(false);
  };

  const handleGuardarNuevosCupos = async () => {
    try {
      // Realizar la solicitud HTTP para crear nuevos cupos con los valores ingresados
      await axios.post('http://127.0.0.1:8000/api/cupos-estacionamiento/', {}, { headers });
      // Actualizar la información de los cupos después de la creación
      fetchCuposInfo();
      setModalIsOpen(false); // Cerrar el modal después de la creación
      console.log('Nuevos cupos creados con éxito');
    } catch (error) {
      console.error('Error al crear nuevos cupos:', error.response?.data || error.message);
    }
  };

  const fetchCuposInfo = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/cupos-estacionamiento/', { headers });
      setCuposInfo(response.data);
    } catch (error) {
      console.error('Error al obtener la información de los cupos:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchCuposInfo();
  }, []);

  const handleCrearCupos = async () => {
    try {
      // Realizar la solicitud HTTP para crear nuevos cupos
      await axios.post('http://127.0.0.1:8000/api/cupos-estacionamiento/', {}, { headers });
      // Actualizar la información de los cupos después de la creación
      fetchCuposInfo();
      setModalIsOpen(true); // Abrir el modal después de la creación
      console.log('Nuevos cupos creados con éxito');
    } catch (error) {
      console.error('Error al crear nuevos cupos:', error.response?.data || error.message);
    }
  };

  const handleEditarCupos = async () => {
    try {
      
      // Realizar la solicitud HTTP para editar cupos existentes
      await axios.put('http://127.0.0.1:8000/api/cupos-estacionamiento/', {}, { headers });
      // Actualizar la información de los cupos después de la edición
      fetchCuposInfo();
      console.log('Cupos editados con éxito');
    } catch (error) {
      console.error('Error al editar cupos:', error.response?.data || error.message);
    }
  };

  return (
    <div>
        <div className="navbar">
            <a href="/tabla" className="btn-navbar">Volver a la tabla
                <img src="https://portales.inacap.cl/web_resources/themes/portal/img/logoFooter.png"alt="Logo A Inacap"/></a>
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

      {/* Botones para crear y editar cupos */}
      <button onClick={handleCrearCupos}>Crear Nuevos Cupos</button>
      &nbsp;
     

      {/* Modal para la creación de nuevos cupos */}
      
      <Modal isOpen={modalIsOpen} onRequestClose={handleModalClose}>
      <div className="modal-content">
        <h2>Crear Nuevos Cupos</h2>
        <label htmlFor="nuevoCupoFuncionarios">Cupo Funcionarios:</label>
        <input
          type="number"
          id="nuevoCupoFuncionarios"
          value={nuevosCupos.nuevoCupoFuncionarios}
          onChange={(e) => setNuevosCupos({ ...nuevosCupos, nuevoCupoFuncionarios: e.target.value })}
        />
        <br />
        <label htmlFor="nuevoCupoEstudiantes">Cupo Estudiantes:</label>
        <input
          type="number"
          id="nuevoCupoEstudiantes"
          value={nuevosCupos.nuevoCupoEstudiantes}
          onChange={(e) => setNuevosCupos({ ...nuevosCupos, nuevoCupoEstudiantes: e.target.value })}
        />
        <br />
        <label htmlFor="nuevoCupoVisitas">Cupo Visitas:</label>
        <input
          type="number"
          id="nuevoCupoVisitas"
          value={nuevosCupos.nuevoCupoVisitas}
          onChange={(e) => setNuevosCupos({ ...nuevosCupos, nuevoCupoVisitas: e.target.value })}
        />
        <br />
        <button onClick={handleGuardarNuevosCupos}>Guardar Nuevos Cupos</button>
        &nbsp;
        <button onClick={handleModalClose}>Cancelar</button>
        </div>

      </Modal>
    </div>
  );
};

export default Cupos;
