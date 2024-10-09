import React from 'react';

const AuthLoader = () => {

  const loaderStyle = {
    width: '25px',
    height: '25px',
    border: '3px solid #FFF',
    borderBottomColor: 'transparent',
    borderRadius: '50%',
    display: 'inline-block',
    boxSizing: 'border-box',
    animation: 'rotation 0.8s linear infinite',
  };

  const rotationKeyframes = `
    @keyframes rotation {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  `;

  return (
    <div>
      <style>
        {rotationKeyframes}
      </style>
      <div style={loaderStyle}></div>
    </div>
  );
};


export default AuthLoader;
