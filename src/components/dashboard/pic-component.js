import * as React from 'react';

export default function Deposits() {
  return (
    <React.Fragment>
      <img 
        src={process.env.PUBLIC_URL + '/srilankatrain.jpg'} 
        alt="Train" 
        style={{ width: '300px', height: '800px' }} // Adjust width as needed
      />
    </React.Fragment>
  );
}
