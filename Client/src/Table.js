import React from "react";

export default function Table({ data }) {
  return (
    <>
      <h3 className="text-left">File Preview:</h3>
      <table className="table-preview">
        <thead>
          <tr key="column_id">
            {data[0].map((item, index) => {
              return <th key={`column_${index}`}>{`Column ${index}`}</th>;
            })}
          </tr>
          <tr key="column_header">
            {data[0].map((header_item, index) => {
              return <th key={`header_${index}`}>{header_item}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => {
            if (index === 0) return <></>;
            else {
              return (
                <tr key={`row_${index}`}>
                  {row.map((row_item, idx) => {
                    return <td key={`${index}_${idx}`}>{row_item}</td>;
                  })}
                </tr>
              );
            }
          })}
        </tbody>
      </table>
    </>
  );
}
