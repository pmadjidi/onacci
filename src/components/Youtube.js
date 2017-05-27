import React, { Component } from 'react';
import { Redirect } from 'react-router'


const YouTubeVideo = ({ id }) => (

    <div className="youtube-wrapper">
        <div className="youtube">
            <iframe
                className="youtube-frame"
                src={`https://www.youtube.com/embed/${id}?autoplay=1`}
                allowFullScreen
            />
        </div>
    </div>

);
