import React, { useEffect, useState } from "react";
import { Button, Card, Container, Form, Image } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import BlogAuthor from "../../components/blog/blog-author/BlogAuthor";
import BlogLike from "../../components/navbar/likes/BlogLike";
import "./styles.css";

const Blog = () => {
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentForm, setCommentForm] = useState({
    comment: "",
  });
  const [loading, setLoading] = useState(true);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentError, setCommentError] = useState("");
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const getBlogPost = async () => {
      try {
        const response = await fetch(`http://localhost:3001/blogPosts/${params.id}`);

        if (!response.ok) {
          navigate("/404");
          return;
        }

        const result = await response.json();

        setBlog(result.data);
      } catch (error) {
        console.log(error);
        navigate("/404");
      } finally {
        setLoading(false);
      }
    };

    const getComments = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/blogPosts/${params.id}/comments`
        );

        if (!response.ok) {
          throw new Error("Errore nel recupero dei commenti");
        }

        const result = await response.json();
        setComments(result.data);
      } catch (error) {
        console.log(error);
        setCommentError("Non è stato possibile caricare i commenti.");
      } finally {
        setCommentsLoading(false);
      }
    };

    getBlogPost();
    getComments();
  }, [navigate, params.id]);

  const handleCommentChange = (event) => {
    const { name, value } = event.target;

    setCommentForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    setSubmittingComment(true);
    setCommentError("");

    const token = localStorage.getItem("token");

    if (!token) {
      setSubmittingComment(false);
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3001/blogPosts/${params.id}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            comment: commentForm.comment.trim(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Errore durante l'invio del commento");
      }

      const result = await response.json();

      setComments(result.data);
      setCommentForm({
        comment: "",
      });
    } catch (error) {
      console.log(error);
      setCommentError("Non è stato possibile inviare il commento.");
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading || !blog) {
    return <div>loading</div>;
  } else {
    return (
      <div className="blog-details-root">
        <Container>
          <Image className="blog-details-cover" src={blog.cover} fluid />
          <h1 className="blog-details-title">{blog.title}</h1>

          <div className="blog-details-container">
            <div className="blog-details-author">
              <BlogAuthor author={blog.author} />
            </div>
            <div className="blog-details-info">
              <div>{blog.createdAt}</div>
              {blog.readTime && (
                <div>{`lettura da ${blog.readTime.value} ${blog.readTime.unit}`}</div>
              )}
              <div
                style={{
                  marginTop: 20,
                }}
              >
                <BlogLike defaultLikes={["123"]} onChange={console.log} />
              </div>
            </div>
          </div>

          <div
            dangerouslySetInnerHTML={{
              __html: blog.content,
            }}
          ></div>

          <section className="blog-comments">
            <h2>Commenti ({comments.length})</h2>

            {commentError && (
              <div className="blog-comments-error">{commentError}</div>
            )}

            {commentsLoading ? (
              <p>Caricamento commenti...</p>
            ) : comments.length > 0 ? (
              <div className="blog-comments-list">
                {comments.map((item) => (
                  <Card key={item._id} className="blog-comment">
                    <Card.Body>
                      <Card.Title>{item.name}</Card.Title>
                      <Card.Text>{item.comment}</Card.Text>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            ) : (
              <p>Non ci sono ancora commenti.</p>
            )}

            <Form className="blog-comment-form" onSubmit={handleCommentSubmit}>
              <Form.Group className="mb-3" controlId="comment-text">
                <Form.Label>Commento</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="comment"
                  value={commentForm.comment}
                  onChange={handleCommentChange}
                  required
                />
              </Form.Group>

              <Button
                type="submit"
                variant="dark"
                disabled={submittingComment}
              >
                {submittingComment ? "Invio..." : "Invia commento"}
              </Button>
            </Form>
          </section>
        </Container>
      </div>
    );
  }
};

export default Blog;
