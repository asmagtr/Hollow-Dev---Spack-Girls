import React from 'react';
import FileForm from './components/FileForm'
import FileCard from './components/FileCard'
import { useState,useEffect } from 'react';
import axios from "axios";

const App = () => {
  const [files,setFiles]=useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3000/get-all");
        setFiles(response.data.files); 
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData(); 
  }, files);
  return (
    <div>
      <div className='my-20'>
      <FileForm files={files}
      setFiles={setFiles}
      />
      </div>

      <div className="mx-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {files.map((file) => (
        <FileCard
            key={file._id}
            id={file._id}
            title={file.title}
            description={file.description}
            onDelete={() => {
              setFiles(files.filter((f) => f._id !== file._id));
            }}
        />
))}
       
      </div>
     
    </div>
  )
}

export default App