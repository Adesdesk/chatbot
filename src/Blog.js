import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Blog.css';

function Blog() {

    const navigate = useNavigate();
    const handleReturnHome = () => {
        navigate('/');
    };
    return (
        <div className="blogContainer">
            <button className="button" onClick={handleReturnHome}>Return Home</button>
            <div className="blogContainer0">

            

                <div className="blogContent">
                    <h1>Welcome to Chatbot-by-Ade Blog!</h1>
                    <h4>Here you find interesting publications and updates on software for business management.</h4>
                    
                    
                </div>
            </div>
        </div>
    );
}

export default Blog;
