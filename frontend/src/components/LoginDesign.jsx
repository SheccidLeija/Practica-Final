import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import "../styles/login.css";

const LoginDesign = () => {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/login", { correo, contrasena });

      // Validación de token
      const { token, rol } = response.data;
      if (!token) {
        setError("Error al iniciar sesión. Intenta de nuevo.");
        return;
      }

      // Guardar en localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("rol", rol);

      navigate("/citas"); // Redirigir a página de citas
    } catch (err) {
      console.error("Error en login:", err);
      setError("Correo o contraseña incorrectos.");
      setContrasena(""); // limpiar contraseña por seguridad
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h4>Inicia sesión en tu cuenta</h4>
        <p>¡Bienvenido de nuevo! Por favor, introduce tus datos.</p>
        <form onSubmit={handleSubmit}>
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
          <div className="login-actions">
            <label>
              <input type="checkbox" /> Recuérdame
            </label>
          </div>
          <button type="submit" className="btn-primary">
            Iniciar sesión
          </button>
        </form>

        {error && <p className="error-message">{error}</p>}

        <div className="register">
          <p className="register-text">
            ¿No tienes una cuenta? <Link to="/register">Regístrate</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginDesign;
