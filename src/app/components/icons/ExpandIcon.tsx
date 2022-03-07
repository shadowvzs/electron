import React, { SVGProps } from 'react';

export const ExpandIcon = (props: SVGProps<any>) => (
    <svg 
        focusable='false' 
        viewBox='0 0 24 24' 
        aria-hidden='true'
        {...props}
    >
        <path d='M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z' />
    </svg>
);