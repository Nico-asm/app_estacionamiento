import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Modal.css';
Modal.setAppElement('#root');

export function Administradores() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const accessToken = localStorage.getItem('accessToken');

  const headers = {
    'Authorization': `Bearer ${accessToken}`,
  };

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/administradores/', { headers });
        setAdmins(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener la lista de administradores:', error.response?.data || error.message);
        setError('Error al cargar la lista de administradores');
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('¿Estás seguro de eliminar este administrador?');

    if (confirmDelete) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/administrador/${id}/`, { headers });
        setAdmins(admins.filter(admin => admin.id !== id));
        console.log(`Administrador con ID ${id} eliminado correctamente.`);
        toast.success('Usuario eliminado con éxito', { position: toast.POSITION.TOP_RIGHT });
      } catch (error) {
        console.error('Error al eliminar el administrador:', error.response?.data || error.message);
        toast.error('Error al eliminar el usuario', { position: toast.POSITION.TOP_RIGHT });
      }
    }
  };

  const handleEdit = (admin) => {
    setSelectedAdmin(admin);
    setEditModalIsOpen(true);
  };

  const handleCloseEditModal = () => {
    setEditModalIsOpen(false);
    setSelectedAdmin(null);
  };
  const closeEditModal = () => {
    setEditModalIsOpen(false);
    setSelectedAdmin(null);
  };

  const handleSaveChanges = async (editedAdmin) => {
    try {
      // Crear un objeto con solo los campos editables
      const editedData = {
        email: editedAdmin.email,
        username: editedAdmin.username,
        // Otros campos que quieras permitir editar
      };
  
      await axios.patch(`http://127.0.0.1:8000/api/administrador/${editedAdmin.id}/`, editedData, { headers });
  
      // Actualizar la lista después de la edición
      setAdmins(admins.map(admin => (admin.id === editedAdmin.id ? { ...admin, ...editedData } : admin)));
  
      console.log(`Administrador con ID ${editedAdmin.id} actualizado correctamente.`);
      toast.success('Cambios guardados con éxito', { position: toast.POSITION.TOP_RIGHT });
      handleCloseEditModal();
    } catch (error) {
      console.error('Error al actualizar el administrador:', error.response?.data || error.message);
      toast.error('Error al guardar cambios', { position: toast.POSITION.TOP_RIGHT });
    }
  };

  return (
    <div>
      <div className="navbar">
        <a href="/tabla" className="btn-navbar">Volver a la tabla
          <img src="https://portales.inacap.cl/web_resources/themes/portal/img/logoFooter.png" alt="Logo A Inacap" />
        </a>
      </div>
      <h1>Lista de Administradores</h1>

      {loading && <p>Cargando...</p>}

      {error && <p>Error: {error}</p>}

      {admins.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre de usuario</th>
              <th>Nombre</th>
              <th>Apellido</th>
              <th>RUT</th>
              <th>Email</th>
              <th>Activo</th>
              <th>Modificar Administrador</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.id}>
                <td>{admin.id}</td>
                <td>{admin.username}</td>
                <td>{admin.nombre}</td>
                <td>{admin.apellido}</td>
                <td>{admin.rut}</td>
                <td>{admin.email}</td>
                <td>{admin.is_active ? 'Sí' : 'No'}</td>
                <td>
                  <button onClick={() => handleEdit(admin)}>Editar</button>
                  &nbsp;
                  <button onClick={() => handleDelete(admin.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal de edición */}
      {selectedAdmin && (
        <Modal isOpen={editModalIsOpen} onRequestClose={handleCloseEditModal}>
        <div className="modal-content">
          <h2>Editar Administrador</h2>
          <label>Nombre de Usuario:</label>
          <input
            type="text"
            name="username"
            value={selectedAdmin.username}
            onChange={(e) => setSelectedAdmin({ ...selectedAdmin, username: e.target.value })}
          />
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={selectedAdmin.email}
            onChange={(e) => setSelectedAdmin({ ...selectedAdmin, email: e.target.value })}
          />
          <button onClick={() => handleSaveChanges(selectedAdmin)}>Guardar Cambios</button>
          &nbsp;
          <button onClick={closeEditModal}>Cancelar</button>
          </div>
        </Modal>
      )}

      <ToastContainer />
    </div>
  );
};

export default Administradores;
