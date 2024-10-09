import React from 'react';

const Loader = () => {
  const loaderStyle = {
    width: '17px',
    height: '17px',
    borderRadius: '50%',
    display: 'inline-block',
    borderTop: '2px solid #FFF',
    borderRight: '3px solid transparent',
    boxSizing: 'border-box',
    animation: 'rotation 0.5s linear infinite',
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
      <span style={loaderStyle} className='mr-5'></span>
    </div>
  );
};

export default Loader;
