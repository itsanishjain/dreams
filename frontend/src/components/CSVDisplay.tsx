import React, { useState } from "react";
import Papa from "papaparse";

interface Props {
  data: Array<any>;
  setData: React.Dispatch<React.SetStateAction<unknown[]>>;
}

const CSVDisplay: React.FC<Props> = ({ setData, data }) => {
  const handleCSVUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      Papa.parse(file, {
        complete: function (results) {
          setData(results.data);
        },
      });
    }
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleCSVUpload} />
      <table>
        {/* <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {row.map((cell: any, j: number) => (
                <td key={j}>
                  <span className="text-orange-500">{cell}</span>
                </td>
              ))}
            </tr>
          ))}
        </tbody> */}
      </table>
    </div>
  );
};

export default CSVDisplay;
