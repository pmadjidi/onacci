import React, { Component } from 'react';
import { Redirect } from 'react-router'


const YouTubeVideo = ({ id }) => (

    <div className="fade-in">
        <div className="youtube">
            <iframe
                className="youtube-frame"
                src={`https://www.youtube.com/embed/${id}?autoplay=0`}
                allowFullScreen
            />
        </div>
    </div>

);

export default YouTubeVideo
