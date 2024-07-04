//import React from 'react'
import { useState, useEffect } from "react";
import { FaRegCopy, FaTable } from "react-icons/fa";
import { IoBarChartOutline } from "react-icons/io5";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import axios from "axios";
import ChartComponent from "./Chartcomponent";
import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";

function Aichatreply({ chatdata }) {
  const { message, sender, sql_query } = chatdata;
  const [ showsql, setShowsql ] = useState(false);
  const [results, setResults] = useState([]);
  const [columns, setColumns] = useState([]);
  const [dataComponentValue, setDataComponentValue] = useState("data");
  const [columns1, setColumns1] = useState(null);
  const [validColumnPairs, setValidColumnPairs] = useState(null);
  const counter = 0
  useEffect(() => {
    const fetchdata = async () => {
      try {
        const result = await axios.post(
          "http://127.0.0.1:8000/sql_chain/gbq_v1/sqlresult",
          {
            sql_query: sql_query,
          }
        );
        console.log(result.data);
        console.log(counter+1)
        setResults(result.data.results);
        setColumns(Object.keys(result.data.results[0]));
        setColumns1(result.data.columns);
        setValidColumnPairs(result.data.valid_column_pairs);
      } catch (e) {
        console.log(e);
      }
    };
    fetchdata();
  }, [sql_query]);



  const handleCopy = () => {
    navigator.clipboard
      .writeText(sql_query)
      .then(() => {
        alert("SQL query copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy the text: ", err);
      });
  };

  const renderers = {
    table: ({  ...props }) => (
      <table
        className="w-[50%] border-[1px] text-xs text-left rtl:text-right text-gray-500 dark:text-gray-400"
        {...props}
      />
    ),
    thead: ({ ...props }) => (
      <thead
        className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
        {...props}
      />
    ),
    tr: ({  ...props }) => (
      <tr
        className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b rounded-md dark:border-gray-700"
        {...props}
      />
    ),
    td: ({  ...props }) => <td className="px-6 py-4" {...props} />,
    th: ({  ...props }) => <th className="px-6 py-4" {...props} />,
    p: ({ ...props }) => <p className="w-[60%]" {...props} />,
  };

  return (
    <div
      className="w-full border-[1px] p-2 rounded-md mb-4 bg-white"
      style={{ boxShadow: "0 5px 5px rgba(0, 0, 0, 0.05)" }}
    >
      <div className="flex">
        <div
          className={`mx-2 flex items-center my-2 px-4 py-2 rounded-lg ${
            dataComponentValue === "data"
              ? "bg-black text-white"
              : "bg-slate-200"
          } `}
          onClick={() => setDataComponentValue("data")}
        >
          <span>
            <FaTable />
          </span>
          <span className=" mx-[4px]">Data</span>
        </div>
        <div
          className={`mx-2 flex items-center my-2 px-4 py-2 rounded-lg ${
            dataComponentValue === "chart"
              ? "bg-black text-white"
              : "bg-slate-200"
          } `}
          onClick={() => setDataComponentValue("chart")}
        >
          <span>
            <IoBarChartOutline />
          </span>
          <span>Chart</span>
        </div>
      </div>
      {/* SQL table*/}
      {dataComponentValue === "data" ? (
        <div>
          <div
            className="border-[2px] w-[150px] py-2 px-4 rounded-md mx-2 my-2 flex items-center justify-between"
            onClick={()=>setShowsql(!showsql)}
          >
            <span>Show SQL </span>
            <span>{showsql ? <IoIosArrowUp /> : <IoIosArrowDown />}</span>
          </div>
          <div
            className={`w-full bg-indigo-950 text-white p-1 rounded-md my-2 mx-2 ${
              showsql ? "block" : "hidden"
            }`}
          >
            <button
              onClick={handleCopy}
              className="mt-2 bg-slate-600 hover:bg-white hover:text-black text-white font-bold py-2 px-4 rounded"
            >
              <FaRegCopy />
            </button>
            <pre>
              <code className="language-sql whitespace-pre-wrap">
                {sql_query}
              </code>
            </pre>
          </div>
          <div className="h-[30vh] overflow-y-scroll rounded-md border-[1px] ">
            <table className="w-full border-[1px] text-sm text-left rtl:text-right text-gray-700 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                  {columns.map((column, index) => (
                    <th className="px-6 py-4" key={index}>
                      {column.replace("_", " ")}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                  >
                    {columns.map((column, colIndex) => (
                      <td key={colIndex} className="px-6 py-4">
                        {typeof row[column] === "number"
                          ? row[column].toFixed(2)
                          : row[column]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="w-[80%] my-4">
          <ChartComponent
            results={results}
            columns={columns1}
            validColumnPairs={validColumnPairs}
          />
        </div>
      )}
      {/*Actual message */}
      <div className="text-[14px]">
        {message && (
          <Markdown
            rehypePlugins={[remarkGfm]}
            components={renderers}
          >{`${message}`}</Markdown>
        )}
      </div>
    </div>
  );
}

export default Aichatreply;
