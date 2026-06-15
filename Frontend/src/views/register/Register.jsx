import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const navigate = useNavigate();

    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        nome: "",
        cognome: "",
        email: "",
        password: "",
        dataDiNascita: "",
        avatar: ""
    });

    const handleChange = e => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async e => {
        e.preventDefault();
        setError("");

        const requiredFields = ["nome", "cognome", "email", "password"];
        const hasEmptyFields = requiredFields.some(
            field => !formData[field].trim()
        );

        if (hasEmptyFields) {
            setError("Compila tutti i campi obbligatori");
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:3001/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(data.message);
                return;
            }

            alert("Registrazione completata!");
            navigate("/login");

        } catch (error) {
            setError("Errore durante la registrazione");
        }
    };

    return (
        <Container style={{ marginTop: "120px", maxWidth: "600px" }}>
            <h2>Registrazione</h2>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Form.Control
                    className="mb-2"
                    placeholder="Nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                />

                <Form.Control
                    className="mb-2"
                    placeholder="Cognome"
                    name="cognome"
                    value={formData.cognome}
                    onChange={handleChange}
                    required
                />

                <Form.Control
                    className="mb-2"
                    placeholder="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <Form.Control
                    className="mb-2"
                    placeholder="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                <Form.Group className="mb-2">
                    <Form.Label>Data di nascita</Form.Label>
                    {/* Impedisce di selezionare una data successiva a oggi. */}
                    <Form.Control
                        type="date"
                        name="dataDiNascita"
                        value={formData.dataDiNascita}
                        max={new Date().toISOString().split("T")[0]}
                        onChange={handleChange}
                    />
                </Form.Group>

                <Form.Control
                    className="mb-3"
                    placeholder="Avatar URL"
                    name="avatar"
                    value={formData.avatar}
                    onChange={handleChange}
                />

                <Button type="submit" variant="dark">
                    Registrati
                </Button>
            </Form>
        </Container>
    );
};

export default Register;
