import React, { useEffect, useState } from "react";
import { Container, Image } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import BlogAuthor from "../../components/blog/blog-author/BlogAuthor";
import BlogLike from "../../components/likes/BlogLike";
import "./styles.css";
const Blog = props => {
  const [blog, setBlog] = useState({});
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Mantiene il formato atteso dal template anche usando i dati MongoDB.
    const mapBlogPost = post => ({
      ...post,
      title: post.titolo,
      content: post.contenuto,
      author: {
        name: post.autore ? `${post.autore.nome} ${post.autore.cognome}` : "",
        avatar: post.autore?.avatar,
      },
    });

    const getBlogPost = async () => {
      try {
        const response = await fetch(`http://localhost:3001/blogPosts/${params.id}`);

        if (!response.ok) {
          navigate("/404");
          return;
        }

        const result = await response.json();

        setBlog(mapBlogPost(result.data));
        setLoading(false);
      } catch (error) {
        console.log(error);
        navigate("/404");
      }
    };

    getBlogPost();
  }, [navigate, params.id]);

  if (loading) {
    return <div>loading</div>;
  } else {
    return (
      <div className="blog-details-root">
        <Container>
          <Image className="blog-details-cover" src={blog.cover} fluid />
          <h1 className="blog-details-title">{blog.title}</h1>

          <div className="blog-details-container">
            <div className="blog-details-author">
              <BlogAuthor {...blog.author} />
            </div>
            <div className="blog-details-info">
              <div>{blog.createdAt}</div>
              <div>{`lettura da ${blog.readTime.value} ${blog.readTime.unit}`}</div>
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
        </Container>
      </div>
    );
  }
};

export default Blog;
