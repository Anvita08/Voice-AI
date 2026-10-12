import React from 'react';

interface ResponseDisplayProps {
    response: string;
}

const ResponseDisplay: React.FC<ResponseDisplayProps> = ({ response }) => {
    return (
        <div className="response-display">
            <h2>AI Response</h2>
            <p>{response}</p>
        </div>
    );
};

export default ResponseDisplay;