import React from 'react';
import Navbar from '../components/Navbar';
import Container from 'react-bootstrap/Container';
import Thread from '../components/Thread';
import PostForm from '../components/PostForm';

const Home = () => {
    return (
        <div>
            <Navbar />
            <Container className="postsContainer">
            <PostForm />
            <Thread />
            </Container>
        </div>
    );
};

export default Home;