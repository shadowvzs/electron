import React from 'react';

export const Loader = () => (
    <div 
        style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            bottom: 0, 
            right: 0, 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center' 
        }}
    >
        <svg id="wrap" width="300" height="300" style={{ filter: 'drop-shadow( 3px 3px 2px rgba(0, 0, 0, 0.5))' }}>
            <svg>
                <circle cx="150" cy="150" r="130" style={{ stroke: 'rgba(0, 0,0,0.1)', strokeWidth: 18, fill: 'transparent', filter: 'drop-shadow(rgba(250, 0, 0, 0.95) -3px -3px 5px)' }} />
                <circle cx="150" cy="150" r="120" style={{ stroke: 'rgba(0,0,0,0.25)', strokeWidth: 1, fill: 'transparent' }} />
                <circle cx="150" cy="150" r="140" style={{ stroke: 'rgba(0,0,0,0.25)', strokeWidth: 1, fill: 'transparent' }} />
                <circle cx="150" cy="150" r="115" style={{ fill: 'rgb(0,0,50)' }}/>
                <path 
                    style={{ 
                        stroke: 'rgba(255, 255, 0, 0.25)', 
                        strokeDasharray: 820, 
                        strokeDashoffset: 820, 
                        strokeWidth: 18, 
                        fill: 'transparent',
                        filter: 'drop-shadow(rgba(0, 0, 0, 0.95) 3px 3px 2px)'
                    }}
                    d="M150,150 m0,-130 a 130,130 0 0,1 0,260 a 130,130 0 0,1 0,-260"
                >
                    <animate attributeName="stroke-dashoffset" dur="6s" to="-820" repeatCount="indefinite"/>
                </path>
            </svg>        
            <svg>
                <path 
                    id="hourglass" 
                    d="M150,150 C60,85 240,85 150,150 C60,215 240,215 150,150 Z" 
                    style={{ stroke: 'white', strokeWidth: 5, fill: 'white' }} 
                />
                <path 
                    id="frame" 
                    d="M100,97 L200, 97 M100,203 L200,203 M110,97 L110,142 M110,158 L110,200 M190,97 L190,142 M190,158 L190,200 M110,150 L110,150 M190,150 L190,150" 
                    style={{ stroke: '#F4A460', strokeWidth: 6, strokeLinecap: 'round' }} 
                />            
                <animateTransform 
                    xlinkHref="#frame" 
                    attributeName="transform" 
                    type="rotate" 
                    begin="0s" 
                    dur="3s" 
                    values="0 150 150; 0 150 150; 180 150 150" 
                    keyTimes="0; 0.8; 1" 
                    repeatCount="indefinite" 
                />
                <animateTransform 
                    xlinkHref="#hourglass" 
                    attributeName="transform" 
                    type="rotate" 
                    begin="0s" 
                    dur="3s" 
                    values="0 150 150; 0 150 150; 180 150 150" 
                    keyTimes="0; 0.8; 1" 
                    repeatCount="indefinite" 
                />
            </svg>        
            <svg>
                <polygon 
                    id="upper" 
                    points="120,125 180,125 150,147" 
                    style={{ fill: 'rgb(0,0,50)', filter: 'filter: drop-shadow(rgba(0, 0, 0, 0.75) 0 0 3px)' }}
                >
                    <animate 
                        attributeName="points" 
                        dur="3s" 
                        keyTimes="0; 0.8; 1" 
                        values="120,125 180,125 150,147; 150,150 150,150 150,150; 150,150 150,150 150,150" 
                        repeatCount="indefinite"
                    />
                </polygon>
                
                <path 
                    id="line" 
                    strokeLinecap="round" 
                    strokeDasharray="1,4" 
                    strokeDashoffset="200.00" 
                    stroke="rgb(0,0,50)" 
                    strokeWidth="2" 
                    d="M150,150 L150,198"
                    style={{ filter: 'drop-shadow(rgba(0, 0, 0, 0.95) 3px 3px 2px)' }}
                >
                    <animate 
                        attributeName="stroke-dashoffset" 
                        dur="3s" 
                        to="1.00" 
                        repeatCount="indefinite"
                    />
                    <animate 
                        attributeName="d" 
                        dur="3s" 
                        to="M150,195 L150,195" 
                        values="M150,150 L150,198; M150,150 L150,198; M150,198 L150,198; M150,195 L150,195" 
                        keyTimes="0; 0.65; 0.9; 1" 
                        repeatCount="indefinite"
                    />
                    <animate 
                        attributeName="stroke" 
                        dur="3s" 
                        keyTimes="0; 0.65; 0.8; 1" 
                        values="rgb(0,0,50);rgb(0,0,50);transparent;transparent" 
                        to="transparent" 
                        repeatCount="indefinite"
                    />
                </path>
                
                <g id="lower">
                    <path 
                        d="M150,180 L180,190 A28,10 0 1,1 120,190 L150,180 Z" 
                        style={{ stroke: 'transparent', strokeWidth: 5, fill: 'rgb(0,0,50)', filter: 'drop-shadow(rgba(0, 0, 0, 0.75) 0 0 3px)' }}
                    >
                        <animateTransform 
                            attributeName="transform" 
                            type="translate" 
                            keyTimes="0; 0.65; 1" 
                            values="0 15; 0 0; 0 0" 
                            dur="3s" 
                            repeatCount="indefinite" 
                        />
                    </path>
                    <animateTransform 
                        xlinkHref="#lower" 
                        attributeName="transform"
                        type="rotate"
                        begin="0s" dur="3s"
                        values="0 150 150; 0 150 150; 180 150 150"
                        keyTimes="0; 0.8; 1"
                        repeatCount="indefinite"
                    />
                </g>
                
                <path 
                    d="M150,150 C60,85 240,85 150,150 C60,215 240,215 150,150 Z" 
                    style={{ stroke: 'white', strokeWidth: 5, fill: 'transparent', filter: 'drop-shadow(rgba(0, 0, 0, 0.25) 3px 3px 2px)' }}
                >
                    <animateTransform 
                        attributeName="transform"
                        type="rotate"
                        begin="0s" dur="3s"
                        values="0 150 150; 0 150 150; 180 150 150"
                        keyTimes="0; 0.8; 1"
                        repeatCount="indefinite"
                    />
                </path>
                
                <path 
                    id="frame" 
                    d="M100,97 L200, 97 M100,203 L200,203" 
                    style={{ stroke: '#8B4513', strokeWidth: 6, strokeLinecap: 'round', filter: 'drop-shadow(rgba(0, 0, 0, 0.95) 3px 3px 2px)' }}
                >
                    <animateTransform 
                        attributeName="transform"
                        type="rotate"
                        begin="0s" dur="3s"
                        values="0 150 150; 0 150 150; 180 150 150"
                        keyTimes="0; 0.8; 1"
                        repeatCount="indefinite"
                    />
                </path>
            </svg>    
        </svg>
    </div>
);