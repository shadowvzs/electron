import React, { SVGProps } from 'react';

export const CollapseIcon = (props: SVGProps<any>) => (
    <svg 
        focusable='false' 
        viewBox='0 0 24 24' 
        aria-hidden='true'
        {...props}
    >
        <path d='M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z' />
    </svg>
);