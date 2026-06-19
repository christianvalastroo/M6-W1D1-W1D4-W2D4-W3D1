import React, { useEffect, useState } from "react";
import { Button, Container, Form, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (token) {
            localStorage.setItem("token", token);
            navigate("/profile");
        }
    }, [navigate]);

    const handleChange = e => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError("");

        // Elimina eventuali token vecchi prima di iniziare un nuovo accesso.
        localStorage.removeItem("token");

        try {
            // Usa l'URL del backend definito nel .env invece di un localhost fisso.
            const response = await fetch(`${process.env.REACT_APP_SERVERURL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Errore durante il login");
                return;
            }

            // Controlla che il token ricevuto permetta di recuperare il profilo.
            const profileResponse = await fetch(`${process.env.REACT_APP_SERVERURL}/me`, {
                headers: {
                    Authorization: `Bearer ${data.token}`
                }
            });

            const profileData = await profileResponse.json();

            if (!profileResponse.ok) {
                setError(
                    profileData.message ||
                    "Il token ricevuto non è valido per il profilo"
                );
                return;
            }

            // Salva il token soltanto dopo la verifica del profilo.
            localStorage.setItem("token", data.token);
            navigate("/profile");
        } catch (error) {
            setError("Errore di connessione al server");
        }
    };

    const handleGoogleLogin = () => {
        localStorage.removeItem("token");
        // Avvia il flusso Google OAuth sul backend configurato.
        window.location.href = `${process.env.REACT_APP_SERVERURL}/auth/google`;
    };

    return (
        <Container style={{ marginTop: "120px", maxWidth: "500px" }}>
            <h2>Login</h2>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                        type="email"
                        name="email"
                        placeholder="Inserisci email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        name="password"
                        placeholder="Inserisci password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Button type="submit" variant="dark">
                    Accedi
                </Button>
            </Form>

            <hr />

            <Button
                type="button"
                variant="outline-danger"
                className="w-100"
                onClick={handleGoogleLogin}
            >
                Accedi con Google
            </Button>
        </Container>
    );
};

export default Login;
