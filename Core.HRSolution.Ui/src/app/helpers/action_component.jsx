import React, { useState, useEffect } from 'react';
import {jwtDecode } from 'jwt-decode';
import { KTIcon } from '../../_metronic/helpers';
// import { Button } from 'react-bootstrap';
const ActionComponent = ({ buttonPermission, actionButton }) => {
    const [hasPermission, setHasPermission] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('kt-auth-react-v');
        if (token) {
          try {
            const decoded = jwtDecode(token);
            const pemission = decoded.permissions.split(','); 
            if(pemission.includes(buttonPermission)){
                setHasPermission(true)
            }
          } catch (error) {
            console.error('Invalid token:', error);
          }
        }
      }, []);

    return (
      <div>
        {hasPermission ? (
          actionButton
        ) : (
          <>
          <span className='text-mute fs-9 m-2'>No Permission</span></>
        )}
      </div>
    );
  };
   
  export default ActionComponent;