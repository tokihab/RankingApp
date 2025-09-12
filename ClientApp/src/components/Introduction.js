
import React from 'react';
import '../Introduction.css';

const Introduction = () => {
    return (
        <div className="introduction-container">
            <h1>Welcome to the Ranking App!</h1>
            <p>
                This application is a tier-ranking tool that allows you to rank items in a tier list. It was originally a .NET weather app API template that has been transformed into this interactive web application.
            </p>
            <p>
                <strong>How it works:</strong> Simply drag and drop the items from the "Unranked" section into the desired tier. The tiers are color-coded to help you visualize your rankings.
            </p>
        </div>
    );
};

export default Introduction;
