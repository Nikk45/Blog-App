import React from 'react'
import blogImg from '../assets/blogimg.jpg'
import { Button } from 'react-bootstrap'

function Home() {

    return (
        <div className='home'>
            <div className="left-container">
                <h1 className="left-heading">Blogging App</h1>
                <p className="left-para">Welcome to our blogging app's homepage—your portal to a world of inspiration and expression.
                    Dive into a seamless experience, discovering diverse blogs that cater to your interests.
                    Join our thriving community, where every click unveils new insights and perspectives.
                </p>
                <div className="left-buttons">
                    <Button className='login-button' href='/login' variant="info">Login</Button>
                    <Button className='register-button' href='/register' variant="dark">Register</Button>
                </div>
            </div>
            <div className="right-container">
                <img src={blogImg} alt="blogimage" />
            </div>
        </div>
    )
}

export default Home
