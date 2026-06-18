import React, { useState } from "react";
import { Container, Form } from "react-bootstrap";
import BlogList from "../../components/blog/blog-list/BlogList";
import "./styles.css";

const Home = props => {
  const [searchTitle, setSearchTitle] = useState("");

  return (
    <Container fluid="sm">
      <h1 className="blog-main-title mb-3">Benvenuto sullo Strive Blog!</h1>
      <Form.Control
        className="mb-4"
        placeholder="Cerca per titolo"
        value={searchTitle}
        onChange={event => setSearchTitle(event.target.value)}
      />
      <BlogList searchTitle={searchTitle} />
    </Container>
  );
};

export default Home;
