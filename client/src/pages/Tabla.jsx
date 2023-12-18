import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Tabla.css";
import "./Modal.css"; // Agrega esta línea para incluir los estilos del modal
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

const mapTipoUsuario = (valor) => {
  switch (valor) {
    case 0:
      return "Funcionario";
    case 1:
      return "Estudiante";
    case 2:
      return "Visita";
    default:
      return "";
  }
};

// Validaciones
const validarPassword = (password) => {
  const errors = [];

  // Longitud mínima
  if (password.length < 8) {
    errors.push("La contraseña debe tener al menos 8 caracteres.");
  }

  // Caracteres especiales
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push("La contraseña debe contener al menos un carácter especial.");
  }

  // Números
  if (!/\d/.test(password)) {
    errors.push("La contraseña debe contener al menos un número.");
  }

  // Mayúsculas y minúsculas
  if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
    errors.push(
      "La contraseña debe contener al menos una letra mayúscula y una letra minúscula."
    );
  }

  // Evitar palabras comunes
  const commonWords = [
    "password",
    "12345678",
    "admin",
    "colocolo",
    "Admin@123",
  ];
  if (commonWords.some((word) => password.toLowerCase().includes(word))) {
    errors.push("La contraseña no debe contener palabras comunes.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

const validarRut = (rut) => {
  rut = rut.replace("-", "");

  if (!/^\d+$/.test(rut.slice(0, -1))) {
    return false;
  }

  const digitoVerificador = rut.slice(-1).toUpperCase();
  if (digitoVerificador !== "K" && !/^\d+$/.test(digitoVerificador)) {
    return false;
  }

  const rutNumerico = parseInt(rut.slice(0, -1), 10);
  let suma = 0;
  let multiplicador = 2;

  for (const d of String(rutNumerico).split("").reverse()) {
    suma += parseInt(d, 10) * multiplicador;
    multiplicador = (multiplicador + 1) % 8 || 2;
  }

  const digitoEsperado = String((11 - (suma % 11)) % 11);

  if (digitoEsperado === "10") {
    return digitoVerificador === "K";
  }

  return digitoVerificador === digitoEsperado;
};

export function Tabla() {
  const [users, setUsers] = useState([]);
  const [reportFormData, setReportFormData] = useState({
    asunto: "",
    descripcion: "",
  });
  const [userFormData, setUserFormData] = useState({
    usu_nombre: "",
    usu_apellido: "",
    usu_rut: "",
    usu_tipo: "",
  });
  const [adminFormData, setAdminFormData] = useState({
    username: "",
    password: "",
  }); // Agrega esta línea para el estado del formulario del administrador
  const [isReportModalOpen, setReportModalOpen] = useState(false);
  const [isUserModalOpen, setUserModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isAdminModalOpen, setAdminModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editingUserData, setEditingUserData] = useState(null);
  const [userImageStates, setUserImageStates] = useState({});

  const reloadPage = () => {
    window.location.reload();
  };
  // Recuperar tokens desde el localStorage
  const accessToken = localStorage.getItem("accessToken");

  const headers = React.useMemo(() => ({
    Authorization: `Bearer ${accessToken}`,
  }), [accessToken]);
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

  const openAdminModal = () => {
    setAdminModalOpen(true);
  };

  const closeAdminModal = () => {
    setAdminModalOpen(false);
  };

  const handleReportChange = (field, value) => {
    setReportFormData({ ...reportFormData, [field]: value });
  };

  const handleUserChange = (field, value) => {
    setUserFormData({ ...userFormData, [field]: value });
  };

  const handleAdminChange = (field, value) => {
    setAdminFormData({ ...adminFormData, [field]: value });
  };
  const openEditModal = (userId) => {
    const userToEdit = users.find((user) => user.id === userId);
    setEditingUserData({ ...userToEdit, usu_rut: userToEdit.usu_rut });
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setEditModalOpen(false);
    setEditingUserData(null);
  };
  const handleDownloadBarcode = async (userId) => {
    try {
      // Llamada a la API para descargar la imagen del código de barras
      const response = await axios.get(
        `http://127.0.0.1:8000/api/descargar-imagen/${userId}/`,
        {
          headers,
          responseType: "blob", // Configura el tipo de respuesta como blob (binario)
        }
      );

      // Crea un enlace temporal para descargar el archivo
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "codigo_barras.jpg"); // Puedes cambiar el nombre del archivo aquí
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      handleInvalidToken(error, history);
      console.error(
        "Error al descargar la imagen:",
        error.response?.data || error.message
      );
      toast.error("Error al descargar la imagen", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };
  // Obtener la lista de usuarios
  useEffect(() => {
    console.log("Fetching users from API...");
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/usuarios/",
          { headers }
        );
        setUsers(response.data);
      } catch (error) {
        handleInvalidToken(error, history);
        console.error(
          "Error al obtener la lista de usuarios:",
          error.response?.data || error.message
        );
      }
    };

    fetchUsers();
  }, [headers]);

  // Funcion para poder editar el usuario
  const handleEditSubmit = async (event) => {
    event.preventDefault();

    if (!editingUserData) {
      console.error("Error: editingUserData is not defined");
      return;
    }

    try {
      const response = await axios.patch(
        `http://127.0.0.1:8000/api/usuario/${editingUserData.id}/`,
        {
          usu_nombre: editingUserData.usu_nombre,
          usu_apellido: editingUserData.usu_apellido,
          usu_tipo: editingUserData.usu_tipo,
          usu_rut: editingUserData.usu_rut,
        },
        { headers }
      );

      // Actualizar el estado de usuarios con los nuevos datos editados
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === editingUserData.id ? response.data : user
        )
      );

      toast.success("Usuario editado con éxito", {
        position: toast.POSITION.TOP_RIGHT,
      });
      closeEditModal();
    } catch (error) {
      handleInvalidToken(error, history);
      console.error(
        "Error al editar el usuario:",
        error.response?.data || error.message
      );
      toast.error("Error al editar el usuario", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };
  // Funcion para poder abrir un modal para realizar reportes
  const handleReportSubmit = async (event) => {
    event.preventDefault();

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/reportes/",
        {
          rep_titulo: reportFormData.asunto,
          rep_descripcion: reportFormData.descripcion,
        },
        { headers }
      );

      setReportFormData({ asunto: "", descripcion: "" });
      closeReportModal();
      toast.success("Reporte creado con éxito", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      handleInvalidToken(error, history);
      console.error(
        "Error al enviar el reporte:",
        error.response?.data || error.message
      );
      toast.error("Error al crear el reporte", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };
  // Funcion para poder cerrar sesion
  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/cerrarsesion/",
        {
          refresh_token: localStorage.getItem("refreshToken"),
        },
        { headers }
      );
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.reload();
      window.location.href = "/inicio-sesion";
    } catch (error) {
      handleInvalidToken(error, history);
      console.error(
        "Error al cerrar sesión:",
        error.response?.data || error.message
      );
    }
  };
  // Función para poder eliminar los usuarios
  const handleDeleteUser = async () => {
    if (
      window.confirm("¿Estás seguro de que deseas eliminar a este usuario?")
    ) {
      try {
        // Obtener el ID del usuario seleccionado
        const userId = selectedUserId;

        // Eliminar el código de barras asociado al usuario
        await axios.delete(
          `http://127.0.0.1:8000/api/detalle-codigo/${userId}/`,
          { headers }
        );

        // Eliminar al usuario
        await axios.delete(`http://127.0.0.1:8000/api/usuario/${userId}/`, {
          headers,
        });

        setUsers(users.filter((user) => user.id !== userId));
        toast.success("Usuario eliminado con éxito", {
          position: toast.POSITION.TOP_RIGHT,
        });
        closeDeleteModal();
      } catch (error) {
        handleInvalidToken(error, history);
        console.error(
          "Error al eliminar el usuario:",
          error.response?.data || error.message
        );
        toast.error("Error al eliminar el usuario", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    }
  };
  const handleVerReportes = () => {
    // Redirige a la página de reportes usando window.location.href
    window.location.href = "/reportes";
  };

  const handleVerAdministradores = () => {
    // Redirige a la página de administradores usando window.location.href
    window.location.href = "/administradores";
  };
  const handleVerCupos = () => {
    // Redirige a la página de cupos usando window.location.href
    window.location.href = "/cupos";
  };
  const [showImage, setShowImage] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  // Función para poder ver la imagen del codigo de barra
  const handleVerImagen = async (userId) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/ver-imagen/${userId}`,
        { headers }
      );
      const imageUrl = response.data.url_imagen;
  
      // Copia el estado actual
      const newUserImageStates = { ...userImageStates };
  
      // Si ya está visible, oculta la imagen, de lo contrario, la muestra
      newUserImageStates[userId] = {
        showImage: !newUserImageStates[userId]?.showImage,
        imageUrl,
      };
  
      setUserImageStates(newUserImageStates);
    } catch (error) {
      handleInvalidToken(error, history);
      console.error(
        "Error al obtener la URL de la imagen:",
        error.response?.data || error.message
      );
    }
  };
  // Validación del rut del usuario
  const handleUserSubmit = async (event) => {
    event.preventDefault();

    if (!validarRut(userFormData.usu_rut)) {
      console.error("RUT no válido");
      toast.error("RUT no válido", { position: toast.POSITION.TOP_RIGHT });
      return;
    }

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/usuarios/",
        {
          usu_apellido: userFormData.usu_apellido,
          usu_nombre: userFormData.usu_nombre,
          usu_rut: userFormData.usu_rut,
          usu_tipo: userFormData.usu_tipo,
        },
        { headers }
      );

      // Asignar el ID del nuevo usuario
      const newUser = response.data;

      // Llamada adicional para obtener el código de barras del nuevo usuario
      const codeResponse = await axios.get(
        `http://127.0.0.1:8000/api/generar-codigo/${newUser.id}/`,
        { headers }
      );

      // Asignar el código de barras al nuevo usuario
      newUser.fk_usuario_id = codeResponse.data.cod_imagen;

      setUserFormData({
        usu_apellido: "",
        usu_nombre: "",
        usu_rut: "",
        usu_tipo: "",
      });

      // Actualizar la lista de usuarios con el nuevo usuario
      setUsers([...users, newUser]);

      toast.success("Usuario creado con éxito", {
        position: toast.POSITION.TOP_RIGHT,
      });

      closeUserModal();
    } catch (error) {
      handleInvalidToken(error, history);
      console.error(
        "Error al crear el usuario:",
        error.response?.data || error.message
      );
      toast.error("Error al crear el usuario", {
        position: toast.POSITION.TOP_RIGHT,
      });
      closeUserModal();
    }
  };
  // Función para generar el código de barras
  const handleGenerateCode = async (userId) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/generar-codigo/${userId}/`,
        { headers }
      );
      console.log("URL de la imagen:", response.data.url_imagen);
      console.log(
        "Respuesta de la API al generar el código de barras:",
        response.data
      ); // Agregamos este console.log
      toast.success("Código de barras generado con éxito", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      handleInvalidToken(error, history);
      console.error(
        "Error al generar el código de barras:",
        error.response?.data || error.message
      );
      toast.error("Error al generar el código de barras", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };
  // Validación del a contraseña para poder registrar administrador
  const handleAdminSubmit = async (event) => {
    event.preventDefault();

    // Validar contraseña antes de enviarla al servidor
    const passwordValidation = validarPassword(adminFormData.password);

    if (!passwordValidation.isValid) {
      toast.error(`Error: ${passwordValidation.errors.join(" ")}`, {
        position: toast.POSITION.TOP_RIGHT,
      });
      return;
    }

    // Enviar solicitud para crear administrador
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/registro-admin/",
        {
          username: adminFormData.username,
          password: adminFormData.password,
          email: adminFormData.email,
          nombre: adminFormData.nombre,
          apellido: adminFormData.apellido,
          rut: adminFormData.rut,
        },
        { headers }
      );

      setAdminFormData({
        username: "",
        password: "",
        email: "",
        nombre: "",
        apellido: "",
        rut: "",
      });
      closeAdminModal();
      toast.success("Administrador creado con éxito", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      handleInvalidToken(error, history);
      console.error(
        "Error al crear administrador:",
        error.response?.data || error.message
      );
      toast.error("Error al crear administrador", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };
  // NavBar para poder navegar
  return (
    <div>
      <div>
  <div className="navbar">
    <button className="btn-navbar" onClick={openReportModal}>
      Realizar reporte
    </button>
    <button className="btn-navbar" onClick={handleVerReportes}>
      Ver Reportes
    </button>
    <button className="btn-navbar" onClick={handleVerAdministradores}>
      Ver Administradores
    </button>
    <button className="btn-navbar" onClick={handleVerCupos}>
      Ver Cupos
    </button>
    <button className="btn-navbar" onClick={openUserModal}>
      Crear usuario
    </button>
    <button className="btn-navbar" onClick={openAdminModal}>
      Crear administrador
    </button>
    <img
      src="https://portales.inacap.cl/web_resources/themes/portal/img/logoFooter.png"
      alt="Logo A Inacap"
    />
  </div>
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
            <th>Modificar Usuario</th>
            <th>Código de barras</th>
            <th>Descargar Código</th>
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
              <td>{user.dentro_estacionamiento ? "Sí" : "No"}</td>
              <td>
                <button className="button" onClick={() => handleGenerateCode(user.id)}>
                  Generar Código
                </button>
              </td>
              <td>
                <button className="button" onClick={() => openEditModal(user.id)}>Editar</button>
                &nbsp;
                <button onClick={() => openDeleteModal(user.id)}>
                  Eliminar
                </button>
              </td>
              <td>
                {user.id && (
                  <div className="image-container">
                  <button className="button" onClick={() => handleVerImagen(user.id)}>
                    {userImageStates[user.id]?.showImage ? "Ocultar" : "Ver"} Código de Barras
                  </button>
                  {userImageStates[user.id]?.showImage && (
                    <img
                      className="codigobarra"
                      src={userImageStates[user.id].imageUrl}
                      alt={`Código de barras de ${user.usu_nombre}`}
                      headers={{ Authorization: `Bearer ${accessToken}` }}
                    />
                  )}
                </div>
                )}
              </td>
              <td>
                <button className="button" onClick={() => handleDownloadBarcode(user.id)}>
                  Descargar Código de Barras
                </button>
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
          &nbsp;
          <button onClick={closeDeleteModal}>Cancelar</button>
        </div>
      </Modal>
      {/* Modal de Edición */}
      <Modal isOpen={isEditModalOpen} onRequestClose={closeEditModal}>
        <div className="modal-content">
          <h2>Editar Usuario</h2>
          <form onSubmit={handleEditSubmit}>
            <label htmlFor="usu_nombre">Nombre:</label>
            <input
              type="text"
              id="usu_nombre"
              name="usu_nombre"
              value={editingUserData?.usu_nombre || ""}
              onChange={(e) =>
                setEditingUserData({
                  ...editingUserData,
                  usu_nombre: e.target.value,
                })
              }
              required
            />
            <br />

            <label htmlFor="usu_apellido">Apellido:</label>
            <input
              type="text"
              id="usu_apellido"
              name="usu_apellido"
              value={editingUserData?.usu_apellido || ""}
              onChange={(e) =>
                setEditingUserData({
                  ...editingUserData,
                  usu_apellido: e.target.value,
                })
              }
              required
            />
            <br />
            <br />

            <label htmlFor="usu_tipo">Tipo de Usuario:</label>
            <select
              id="usu_tipo"
              name="usu_tipo"
              value={editingUserData?.usu_tipo || ""}
              onChange={(e) =>
                setEditingUserData({
                  ...editingUserData,
                  usu_tipo: e.target.value,
                })
              }
              required
            >
              <option value="0">Funcionario</option>
              <option value="1">Estudiante</option>
              <option value="2">Visita</option>
            </select>

            <br />

            <input type="submit" value="Guardar Cambios" />
          </form>
          <button onClick={closeEditModal}>Cancelar</button>
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
              onChange={(e) => handleReportChange("asunto", e.target.value)}
              required
            />
            <br />
            <label htmlFor="descripcion">Descripción:</label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={reportFormData.descripcion}
              onChange={(e) =>
                handleReportChange("descripcion", e.target.value)
              }
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
              onChange={(e) => handleUserChange("usu_nombre", e.target.value)}
              required
            />
            <br />
            <label htmlFor="usu_apellido">Apellido:</label>
            <input
              type="usu_apellido"
              id="usu_apellido"
              name="usu_apellido"
              value={userFormData.usu_apellido}
              onChange={(e) => handleUserChange("usu_apellido", e.target.value)}
              required
            />
            <br />
            <label htmlFor="usu_rut">RUT:</label>
            <input
              type="usu_rut"
              id="usu_rut"
              name="usu_rut"
              value={userFormData.usu_rut}
              onChange={(e) => handleUserChange("usu_rut", e.target.value)}
              required
            />
            <br />
            <label htmlFor="usu_tipo">Tipo de Usuario:</label>
            <select
              id="usu_tipo"
              name="usu_tipo"
              value={userFormData.usu_tipo}
              onChange={(e) => handleUserChange("usu_tipo", e.target.value)}
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

      {/* Modal de Administrador */}
      <Modal isOpen={isAdminModalOpen} onRequestClose={closeAdminModal}>
        <div className="modal-content">
          <h2>Crear Administrador</h2>
          <form onSubmit={handleAdminSubmit}>
            <label htmlFor="admin_username">Nombre de Usuario:</label>
            <input
              type="text"
              id="admin_username"
              name="admin_username"
              value={adminFormData.username}
              onChange={(e) => handleAdminChange("username", e.target.value)}
              required
            />
            <br />
            <label htmlFor="admin_password">Contraseña:</label>
            <input
              type="password"
              id="admin_password"
              name="admin_password"
              value={adminFormData.password}
              onChange={(e) => handleAdminChange("password", e.target.value)}
              required
            />
            <br />
            {/* Agrega los siguientes campos para email, nombre, apellido, y rut */}
            <label htmlFor="admin_email">Correo Electrónico:</label>
            <input
              type="email"
              id="admin_email"
              name="admin_email"
              value={adminFormData.email}
              onChange={(e) => handleAdminChange("email", e.target.value)}
              required
            />
            <br />
            <label htmlFor="admin_nombre">Nombre:</label>
            <input
              type="text"
              id="admin_nombre"
              name="admin_nombre"
              value={adminFormData.nombre}
              onChange={(e) => handleAdminChange("nombre", e.target.value)}
              required
            />
            <br />
            <label htmlFor="admin_apellido">Apellido:</label>
            <input
              type="text"
              id="admin_apellido"
              name="admin_apellido"
              value={adminFormData.apellido}
              onChange={(e) => handleAdminChange("apellido", e.target.value)}
              required
            />
            <br />
            <label htmlFor="admin_rut">RUT:</label>
            <input
              type="text"
              id="admin_rut"
              name="admin_rut"
              value={adminFormData.rut}
              onChange={(e) => handleAdminChange("rut", e.target.value)}
              required
            />
            <br />
            {/* Fin de los campos adicionales */}
            <input type="submit" value="Crear Administrador" />
          </form>
          <button onClick={closeAdminModal}>Cerrar</button>
        </div>
      </Modal>

      {/* Toast Container */}
      <ToastContainer />

      <button className="logout-btn" onClick={handleLogout}>
        Cerrar sesión
      </button>
    </div>
  );
}

export default Tabla;
