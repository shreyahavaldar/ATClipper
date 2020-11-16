import React from "react";

export default function Table({ data }) {
  //Create the table preview by mapping each row in data to an HTML table
  return (
    <>
      <table className="table-preview">
        <thead>
          <tr key="column_id">
            {
              //Create the header row by mapping each column to a header element
              data[0].map((item, index) => {
                return <th key={`column_${index}`}>{`Column ${index}`}</th>;
              })
            }
          </tr>
          <tr key="column_header">
            {
              //Create the header row by mapping each item in the first data row to a header element
              data[0].map((header_item, index) => {
                return <th key={`header_${index}`}>{header_item}</th>;
              })
            }
          </tr>
        </thead>
        <tbody>
          {
            //Create a row by mapping each item in the data row to a <td> element
            data.map((row, index) => {
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
            })
          }
        </tbody>
      </table>
    </>
  );
}
