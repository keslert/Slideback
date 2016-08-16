import React from 'react';
import css from '../containers/App.css';

const Checkbox = ({
  label,
  onClick,
  checked
}) => (
  <div className={css.checkbox}>
    <label>
      <input type="checkbox" checked={checked} onChange={onClick} />
      {label}
    </label>
  </div>
)
export default Checkbox;