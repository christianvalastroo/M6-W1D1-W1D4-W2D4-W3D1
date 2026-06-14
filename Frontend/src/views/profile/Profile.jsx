import React, { useCallback, useEffect, useState } from "react";
import { Alert, Button, Card, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const navigate = useNavigate();

    const [author, setAuthor] = useState(null);
    const [error, setError] = useState("");

    const getProfile = useCallback(async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            const response = await fetch("http://localhost:3001/auth/me", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                // Un token scaduto o non valido obbliga a effettuare nuovamente l'accesso.
                if (response.status === 401) {
                    localStorage.removeItem("token");
                    navigate("/login");
                    return;
                }

                setError(data.message || "Errore nel recupero del profilo");
                return;
            }

            setAuthor(data.data);
        } catch (error) {
            setError("Errore di connessione al server");
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
        window.location.reload();
    };

    // Converte la data ricevuta dal Backend nel formato italiano.
    const formatDate = date => {
        if (!date) {
            return "Non specificata";
        }

        return new Date(date).toLocaleDateString("it-IT");
    };

    useEffect(() => {
        getProfile();
    }, [getProfile]);

    return (
        <Container style={{ marginTop: "120px", maxWidth: "600px" }}>
            <h2>Profilo utente</h2>

            {error && <Alert variant="danger">{error}</Alert>}

            {author && (
                <Card>
                    {author.avatar && (
                        <Card.Img
                            variant="top"
                            src={author.avatar}
                            style={{ height: "300px", objectFit: "cover" }}
                        />
                    )}

                    <Card.Body>
                        <Card.Title>
                            {author.nome} {author.cognome}
                        </Card.Title>

                        <Card.Text>
                            <strong>Email:</strong> {author.email}
                        </Card.Text>

                        <Card.Text>
                            <strong>Data di nascita:</strong>{" "}
                            {formatDate(author.dataDiNascita)}
                        </Card.Text>

                        <Button variant="danger" onClick={handleLogout}>
                            Logout
                        </Button>
                    </Card.Body>
                </Card>
            )}
        </Container>
    );
};

export default Profile;
