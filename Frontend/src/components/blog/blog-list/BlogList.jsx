import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import BlogItem from "../blog-item/BlogItem";

const BlogList = props => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Adatta i nomi dei campi del backend al template fornito.
    const mapBlogPost = post => ({
      ...post,
      title: post.titolo,
      content: post.contenuto,
      author: {
        name: post.autore ? `${post.autore.nome} ${post.autore.cognome}` : "",
        avatar: post.autore?.avatar,
      },
    });

    const getBlogPosts = async () => {
      try {
        const response = await fetch("http://localhost:3001/blogPosts");
        const result = await response.json();

        setPosts(result.data.map(mapBlogPost));
      } catch (error) {
        console.log(error);
      }
    };

    getBlogPosts();
  }, []);

  return (
    <Row>
      {posts.map((post, i) => (
        <Col
          key={post._id || `item-${i}`}
          md={4}
          style={{
            marginBottom: 50,
          }}
        >
          <BlogItem {...post} />
        </Col>
      ))}
    </Row>
  );
};

export default BlogList;
