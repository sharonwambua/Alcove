import React from 'react';

const SearchBar = ({ value, onChange }) => {
  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '360px' }}>
      <input 
        type="text" 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        placeholder="🔍 Search designation or location node..." 
        style={{ width: '100%', padding: '0.65rem 1rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}
      />
    </div>
  );
};

export default SearchBar;