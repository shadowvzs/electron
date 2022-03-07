import React, { SVGProps } from 'react';

export const MenuIcon = (props: SVGProps<any>) => (
    <svg 
        focusable='false' 
        viewBox='0 0 24 24' 
        aria-hidden='true'
        {...props}
    >
        <path d='M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z' />
    </svg>
);