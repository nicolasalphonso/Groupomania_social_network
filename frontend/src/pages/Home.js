import React from "react";
import Navbar from "../components/Navbar";
import Container from "react-bootstrap/Container";
import Thread from "../components/Thread";

const Home = () => {
  return (
    <div>
      <Navbar />
      <Container className="postsContainer">
        <Thread />
      </Container>
    </div>
  );
};

export default Home;
