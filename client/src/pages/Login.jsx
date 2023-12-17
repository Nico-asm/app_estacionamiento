import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";

export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Lógica de inicio de sesión...
      const response = await axios.post(
        "http://127.0.0.1:8000/api/iniciarsesion/",
        {
          username,
          password,
        }
      );

      if (response && response.data) {
        localStorage.setItem("accessToken", response.data.access);

        // Mostrar toast de inicio de sesión exitoso
        toast.success("Inicio de sesión exitoso");

        // Redirigir solo si el inicio de sesión es exitoso
        window.location.href = "/tabla";
      } else {
        console.error("La respuesta o los datos son undefined.");
      }
    } catch (error) {
      console.error(
        "Error al realizar la solicitud:",
        error.response?.data || error.message
      );

      // Mostrar toasts en caso de error
      if (error.response?.status === 401) {
        toast.error(
          "Credenciales inválidas. Verifica el usuario y la contraseña."
        );
      } else {
        toast.error(
          "Error al realizar la solicitud. Inténtalo de nuevo más tarde."
        );
      }
    }
  };

  return (
    <div className="container">
      <img
        src="https://www.maray.cl/wp-content/uploads/2023/06/WhatsApp-Image-2023-06-17-at-15.07.27-e1687206845213.jpeg"
        alt=""
        className="background-image"
      />
      <div className="form-container">
        <img
          src="https://portales.inacap.cl/web_resources/themes/portal/img/logoFooter.png"
          alt="Logo"
          className="logo"
        />
        <h2>Iniciar sesión</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="username"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" style={{ backgroundColor: "rgb(208, 0, 0)" }}>
            Iniciar sesión
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Login;
