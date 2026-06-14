import React from "react";
import { Button, Container, Navbar } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import "./styles.css";

const NavBar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Navbar expand="lg" className="blog-navbar" fixed="top">
      <Container className="justify-content-between">
        <Navbar.Brand as={Link} to="/">
          <img className="blog-navbar-brand" alt="logo" src={logo} />
        </Navbar.Brand>

        <div className="d-flex gap-2">
          <Button
            as={Link}
            to="/new"
            className="blog-navbar-add-button bg-dark"
            size="lg"
          >
            Nuovo Articolo
          </Button>

          {!token && (
            <>
              <Button as={Link} to="/login" variant="outline-dark" size="lg">
                Login
              </Button>

              <Button as={Link} to="/register" variant="dark" size="lg">
                Registrati
              </Button>
            </>
          )}

          {token && (
            <>
              <Button as={Link} to="/profile" variant="outline-dark" size="lg">
                Profilo
              </Button>

              <Button onClick={handleLogout} variant="danger" size="lg">
                Logout
              </Button>
            </>
          )}
        </div>
      </Container>
    </Navbar>
  );
};

export default NavBar;