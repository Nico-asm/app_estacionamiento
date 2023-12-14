import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Tabla.css';
import './Formularios.css';
Modal.setAppElement('#root'); // Agrega esta línea para definir el elemento principal de tu aplicación


const mapTipoUsuario = (valor) => {
  switch (valor) {
    case 0:
      return 'Funcionario';
    case 1:
      return 'Estudiante';
    case 2:
      return 'Visita';
    default:
      return '';
  }
};

const validarRut = (rut) => {
  rut = rut.replace("-", "");

  if (!rut.slice(0, -1).match(/^\d+$/)) {
    return false;
  }

  const digitoVerificador = rut.slice(-1).toUpperCase();
  if (digitoVerificador !== 'K' && !digitoVerificador.match(/^\d+$/)) {
    return false;
  }

  const rutNumerico = parseInt(rut.slice(0, -1), 10);
  let suma = 0;
  let multiplicador = 2;

  for (const d of String(rutNumerico).split('').reverse()) {
    suma += parseInt(d, 10) * multiplicador;
    multiplicador = (multiplicador + 1) % 8 || 2;
  }

  const digitoEsperado = String((11 - suma % 11) % 11);

  if (digitoEsperado === '10') {
    return digitoVerificador === 'K';
  }

  return digitoVerificador === digitoEsperado;
};

export function Tabla() {
  const [users, setUsers] = useState([]);
  const [reportFormData, setReportFormData] = useState({ asunto: '', descripcion: '' });
  const [userFormData, setUserFormData] = useState({ usu_nombre: '', usu_apellido: '', usu_rut: '', usu_tipo: '' });
  const [isReportModalOpen, setReportModalOpen] = useState(false);
  const [isUserModalOpen, setUserModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);

  const reloadPage = () => {
    window.location.reload();
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/usuarios/');
        setUsers(response.data);
      } catch (error) {
        console.error('Error al obtener la lista de usuarios:', error.response?.data || error.message);
      }
    };

    fetchUsers();
  }, []);

  const openReportModal = () => {
    setReportModalOpen(true);
  };

  const closeReportModal = () => {
    setReportModalOpen(false);
  };

  const openUserModal = () => {
    setUserModalOpen(true);
  };

  const closeUserModal = () => {
    setUserModalOpen(false);
    reloadPage();
  };

  const openDeleteModal = (userId) => {
    setDeleteModalOpen(true);
    setSelectedUserId(userId);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedUserId(null);
  };

  const handleReportChange = (field, value) => {
    setReportFormData({ ...reportFormData, [field]: value });
  };

  const handleUserChange = (field, value) => {
    setUserFormData({ ...userFormData, [field]: value });
  };

  const handleReportSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.post('http://127.0.0.1:8000/api/reportes/', {
        asunto: reportFormData.asunto,
        descripcion: reportFormData.descripcion,
      });

      setReportFormData({ asunto: '', descripcion: '' });
      closeReportModal();
    } catch (error) {
      console.error('Error al enviar el reporte:', error.response?.data || error.message);
    }
  };

  const handleDeleteUser = async () => {
    if (window.confirm("¿Estás seguro de que deseas eliminar a este usuario?")) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/usuario/${selectedUserId}/`);
        setUsers(users.filter((user) => user.id !== selectedUserId));
        toast.success('Usuario eliminado con éxito', { position: toast.POSITION.TOP_RIGHT });
        closeDeleteModal();
      } catch (error) {
        console.error('Error al eliminar el usuario:', error.response?.data || error.message);
        toast.error('Error al eliminar el usuario', { position: toast.POSITION.TOP_RIGHT });
      }
    }
  };

  const handleUserSubmit = async (event) => {
    event.preventDefault();

    if (!validarRut(userFormData.usu_rut)) {
      console.error('RUT no válido');
      toast.error('RUT no válido', { position: toast.POSITION.TOP_RIGHT });
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/usuarios/', {
        usu_apellido: userFormData.usu_apellido,
        usu_nombre: userFormData.usu_nombre,
        usu_rut: userFormData.usu_rut,
        usu_tipo: userFormData.usu_tipo,
      });
      // Asignar el ID del nuevo usuario
      const newUser = response.data;
    
      // Llamada adicional para obtener el código de barras del nuevo usuario
      const codeResponse = await axios.get(`http://127.0.0.1:8000/api/generar-codigo/${newUser.id}/`);
      newUser.fk_usuario_id = codeResponse.data.cod_imagen;
    
      setUserFormData({ usu_apellido: '', usu_nombre: '', usu_rut: '', usu_tipo: '' });
      closeUserModal();
      setUsers([...users, newUser]); // Actualizar la lista de usuarios con el nuevo usuario
      toast.success('Usuario creado con éxito', { position: toast.POSITION.TOP_RIGHT });
    } catch (error) {
      toast.success('Usuario creado con éxito', { position: toast.POSITION.TOP_RIGHT });
      closeUserModal();
    }
  };

  const handleGenerateCode = async (userId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/generar-codigo/${userId}/`);
      console.log("Respuesta de la API al generar el código de barras:", response.data); // Agregamos este console.log
      toast.success('Código de barras generado con éxito', { position: toast.POSITION.TOP_RIGHT });
    } catch (error) {
      console.error('Error al generar el código de barras:', error.response?.data || error.message);
      toast.error('Error al generar el código de barras', { position: toast.POSITION.TOP_RIGHT });
    }
  };

  return (
    <div>
      <div className="navbar">
        <a href="javascript:void(0)" className="btn-navbar" onClick={openReportModal}>
          Realizar reporte
        </a>
        <a href="javascript:void(0)" className="btn-navbar" onClick={openUserModal}>
          Crear usuario
        </a>
        <img
          src="https://portales.inacap.cl/web_resources/themes/portal/img/logoFooter.png"
          alt="Logo A Inacap"
        />
      </div>

      <h1>Lista de usuarios autorizados</h1>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>RUT</th>
            <th>Tipo de Usuario</th>
            <th>Fecha de creacion</th>
            <th>Dentro Estacionamiento</th>
            <th>Generar Código</th>
            <th>Código de Barras</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.usu_nombre}</td>
              <td>{user.usu_apellido}</td>
              <td>{user.usu_rut}</td>
              <td>{mapTipoUsuario(user.usu_tipo)}</td>
              <td>{new Date(user.usu_fecha).toLocaleDateString()}</td>              
              <td>{user.dentro_estacionamiento ? 'Sí' : 'No'}</td>
              <td>
                <button onClick={() => handleGenerateCode(user.id)}>Generar Código</button>
              </td>
              <td>
                <button onClick={() => openEditModal(user.id)}>Editar</button>
                <button onClick={() => openDeleteModal(user.id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de Eliminación */}
      <Modal isOpen={isDeleteModalOpen} onRequestClose={closeDeleteModal}>
        <div className="modal-content">
          <h2>Eliminar Usuario</h2>
          <p>¿Estás seguro de que deseas eliminar a este usuario?</p>
          <button onClick={handleDeleteUser}>Sí, eliminar</button>
          <button onClick={closeDeleteModal}>Cancelar</button>
        </div>
      </Modal>

      {/* Modal de Reporte */}
      <Modal isOpen={isReportModalOpen} onRequestClose={closeReportModal}>
        <div className="modal-content">
          <h2>Realizar reporte</h2>
          <form onSubmit={handleReportSubmit}>
            <label htmlFor="asunto">Asunto:</label>
            <input
              type="text"
              id="asunto"
              name="asunto"
              value={reportFormData.asunto}
              onChange={(e) => handleReportChange('asunto', e.target.value)}
              required
            />
            <br />
            <label htmlFor="descripcion">Descripción:</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={reportFormData.descripcion}
              onChange={(e) => handleReportChange('descripcion', e.target.value)}
              rows="4"
              cols="50"
              required
            />
            <br />
            <input type="submit" value="Generar reporte" />
          </form>
          <button onClick={closeReportModal}>Cerrar</button>
        </div>
      </Modal>

      {/* Modal de Usuario */}
      <Modal isOpen={isUserModalOpen} onRequestClose={closeUserModal}>
        <div className="modal-content">
          <h2>Agregar Usuario</h2>
          <form onSubmit={handleUserSubmit}>
            <label htmlFor="usu_nombre">Nombre:</label>
            <input
              type="usu_nombre"
              id="usu_nombre"
              name="usu_nombre"
              value={userFormData.usu_nombre}
              onChange={(e) => handleUserChange('usu_nombre', e.target.value)}
              required
            />
            <br />
            <label htmlFor="usu_apellido">Apellido:</label>
            <input
              type="usu_apellido"
              id="usu_apellido"
              name="usu_apellido"
              value={userFormData.usu_apellido}
              onChange={(e) => handleUserChange('usu_apellido', e.target.value)}
              required
            />
            <br />
            <label htmlFor="usu_rut">RUT:</label>
            <input
              type="usu_rut"
              id="usu_rut"
              name="usu_rut"
              value={userFormData.usu_rut}
              onChange={(e) => handleUserChange('usu_rut', e.target.value)}
              required
            />
            <br />
            <label htmlFor="usu_tipo">Tipo de Usuario:</label>
            <select
              id="usu_tipo"
              name="usu_tipo"
              value={userFormData.usu_tipo}
              onChange={(e) => handleUserChange('usu_tipo', e.target.value)}
              required
            >
              <option value="0">Funcionario</option>
              <option value="1">Estudiante</option>
              <option value="2">Visita</option>
            </select>
            <br />
            <input type="submit" value="Registrar Usuario" />
          </form>
          <button onClick={closeUserModal}>Cerrar</button>
        </div>
      </Modal>

      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
}

export default Tabla;
