import React from 'react';

type ToggleProps = {
  checked?: boolean;
  handler?: () => void;
}

const Toggle = ({
  handler = () => {},
}: ToggleProps) => {
  return (
    <label className="toggle">
      <input type="checkbox" 
        onChange={handler}
      />
      <span className="slider"></span>
    </label>
  );
}

export default Toggle;
