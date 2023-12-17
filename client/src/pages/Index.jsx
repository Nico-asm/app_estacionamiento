import React from "react";
import { Link } from "react-router-dom";
import "./Index.css";

export function Index() {
  return (
    <div>
      <div className="navbar">
        <a href="#">Información</a>
        <a href="#">Acerca de nosotros</a>
        <a href="#">Contactos</a>
        <img
          src="https://portales.inacap.cl/web_resources/themes/portal/img/logoFooter.png"
          alt="Logo"
          className="logo"
        />
      </div>

      <div className="content">
        <h1>Sistema de estacionamiento Inacap</h1>
        <Link to="/inicio-sesion">
          <button style={{ backgroundColor: "rgb(208, 0, 0)" }}>
            Iniciar sesión
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Index;
