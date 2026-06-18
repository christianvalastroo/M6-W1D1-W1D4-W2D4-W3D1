import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import BlogItem from "../blog-item/BlogItem";

const BlogList = ({ searchTitle = "" }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getBlogPosts = async () => {
      try {
        // L'URL del backend arriva dal .env, così cambia tra locale e deploy.
        const response = await fetch(`${process.env.REACT_APP_SERVERURL}/blogPosts`);

        if (response.ok === false) {
          throw new Error("Errore nel recupero dei blog post");
        }

        const result = await response.json();

        setPosts(result.data);
      } catch (error) {
        console.log(error);
      }
    };

    getBlogPosts();
  }, []);

  const filteredPosts = posts.filter((post) => (
    post.title.toLowerCase().includes(searchTitle.trim().toLowerCase())
  ));

  return (
    <Row>
      {filteredPosts.map((post, i) => (
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
