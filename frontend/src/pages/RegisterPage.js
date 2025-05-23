import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import "../styles/register.css";

const RegisterPage = () => {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [rol, setRol] = useState("cliente");
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post("/register", { nombre, correo, contrasena, rol });
      setMensaje("Usuario registrado. Redirigiendo...");
      setTimeout(() => navigate("/"), 2000);
    } catch {
      setMensaje("Error al registrar usuario");
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h4>Crear una cuenta</h4>
        <p>Introduce tus datos para registrarte.</p>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            className="form-control"
            placeholder="Nombre completo"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
          <input
            type="email"
            className="form-control"
            placeholder="Correo electrónico"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
          <input
            type="password"
            className="form-control"
            placeholder="Contraseña"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />
          <select
            className="form-control"
            value={rol}
            onChange={(e) => setRol(e.target.value)}
            required
          >
            <option value="cliente">Cliente</option>
            <option value="veterinario">Veterinario</option>
          </select>
          <button type="submit" className="btn-primary">
            Registrarse
          </button>
        </form>

        {mensaje && <p className="register-message">{mensaje}</p>}

        <div className="login-link">
          <p className="register-text">
            ¿Ya tienes cuenta? <Link to="/">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
