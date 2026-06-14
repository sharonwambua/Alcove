import React from 'react';

const DataTable = ({ headers, data, renderRow }) => {
  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            {headers.map((h, i) => <th key={i}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? data.map((item, index) => renderRow(item, index)) : (
            <tr><td colSpan={headers.length} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No records discovered.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;