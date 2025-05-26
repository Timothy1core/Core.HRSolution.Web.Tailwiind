import React, { forwardRef } from 'react';
import InputMask from 'react-input-mask-next';

const MaskedInput = forwardRef(({ mask, ...props }, ref) => {
    return (
      <InputMask mask={mask} {...props}>
        {(inputProps) => (
          <input
            {...inputProps}
            ref={ref}
            className={`form-control form-control-sm ${props.className || ''}`}
          />
        )}
      </InputMask>
    );
  });
  
  export default MaskedInput;