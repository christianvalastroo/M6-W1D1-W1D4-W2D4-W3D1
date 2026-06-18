import React, { useState } from "react";
import { Alert, Button, Container, Form, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./styles.css";
import draftToHtml from "draftjs-to-html";

const NewBlogPost = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const [blogPost, setBlogPost] = useState({
    title: "",
    category: "",
    cover: "",
    readTime: {
      value: 1,
      unit: "minutes",
    },
    content: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "readTimeValue") {
      setBlogPost({
        ...blogPost,
        readTime: {
          ...blogPost.readTime,
          value: Number(value),
        },
      });
    } else {
      setBlogPost({
        ...blogPost,
        [name]: value,
      });
    }
  };

  const handleEditorChange = (value) => {
    setBlogPost({
      ...blogPost,
      content: draftToHtml(value),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_SERVERURL}/blogPosts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(blogPost),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Errore durante la creazione del blog post");
        return;
      }

      alert("Blog post creato!");
      navigate("/");
    } catch (error) {
      setError("Errore di connessione al server");
    }
  };

  return (
    <Container className="new-blog-container">
      {error && <Alert variant="danger">{error}</Alert>}

      <Form className="mt-5" onSubmit={handleSubmit}>
        <Form.Group controlId="blog-title" className="mt-3">
          <Form.Label>Titolo</Form.Label>
          <Form.Control
            size="lg"
            placeholder="Title"
            name="title"
            value={blogPost.title}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="blog-cover" className="mt-3">
          <Form.Label>Cover URL</Form.Label>
          <Form.Control
            size="lg"
            placeholder="Inserisci URL cover"
            name="cover"
            value={blogPost.cover}
            onChange={handleChange}
          />
        </Form.Group>

        <Row>
          <Col>
            <Form.Group controlId="blog-readtime" className="mt-3">
              <Form.Label>Read time</Form.Label>
              <Form.Control
                size="lg"
                type="number"
                min="1"
                name="readTimeValue"
                value={blogPost.readTime.value}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          <Col>
            <Form.Group controlId="blog-category" className="mt-3">
              <Form.Label>Categoria</Form.Label>
              <Form.Control
                size="lg"
                as="select"
                name="category"
                value={blogPost.category}
                onChange={handleChange}
              >
                <option value="">Seleziona categoria</option>
                <option value="Technology">Technology</option>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="React">React</option>
                <option value="MongoDB">MongoDB</option>
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group controlId="blog-content" className="mt-3">
          <Form.Label>Contenuto Blog</Form.Label>
          <Editor onChange={handleEditorChange} className="new-blog-content" />
        </Form.Group>

        <Form.Group className="d-flex mt-3 justify-content-end">
          <Button type="reset" size="lg" variant="outline-dark">
            Reset
          </Button>

          <Button
            type="submit"
            size="lg"
            variant="dark"
            style={{ marginLeft: "1em" }}
          >
            Invia
          </Button>
        </Form.Group>
      </Form>
    </Container>
  );
};

export default NewBlogPost;
