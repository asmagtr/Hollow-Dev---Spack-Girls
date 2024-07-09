import React from 'react';
import FileForm from './components/FileForm'
import FileCard from './components/FileCard'
import { useState,useEffect } from 'react';
import axios from "axios";

const App = () => {
  const [files,setFiles]=useState([]);
  const [filesUpdated,setFilesUpdated]=useState(0);
  const [error,setError]=useState(null);
  const[fileId,setFileId]=useState(null);
  const[fileInfo,setFileInfo]=useState(null)
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
  }, filesUpdated);

  const handleSearch = async (e) => {
   e.preventDefault();
   setError('');
    try {
          const response = await axios.get(`http://localhost:3000/get-file-info/${fileId}`);
          setFileInfo(response.data.fileInfo);
     } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
            setError(error.response.data.message);
          } else {
            setError('An unexpected error occurred. Please try again.');
          }
      }
      };


  return (
    <div>
      <div className='my-20'>
      <FileForm files={files}
      setFiles={setFiles}
      filesUpdated={filesUpdated}
      setFilesUpdated={setFilesUpdated}
      />
      </div>

      <div className="mx-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {files.map((file) => (
        <FileCard
            key={file._id}
            id={file._id}
            title={file.title}
            description={file.description}
            onDelete={() => {
              setFiles(files.filter((f) => f._id !== file._id));
              setFilesUpdated(filesUpdated+1)
            }}
            files={files}
            setFiles={setFiles}
            filesUpdated={filesUpdated}
            setFilesUpdated={setFilesUpdated}
            onClicking={()=>{
              window.open(file.fileCloudinary, '_blank');
            }}
        />
))}
       
      </div>


      <div className="max-w-xl mx-auto p-8 bg-white shadow-md rounded mt-8">
        <form onSubmit={handleSearch}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fileId">
              Get File by ID
            </label>
            <input
              id="fileId"
              type="text"
              value={fileId}
              onChange={(e) => setFileId(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          {error && <p className="text-red-500 text-xs py-4">{error}</p>}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Search
            </button>
          </div>
        </form>

        {fileInfo && (
          <div className="max-w-xl mx-auto p-8 bg-white shadow-md rounded mt-8">
            <h2 className="text-2xl font-bold mb-4">File Information</h2>
            <p><strong>Title:</strong> {fileInfo.title}</p>
            <p><strong>Description:</strong> {fileInfo.description}</p>
            <p><strong>Name:</strong> {fileInfo.name}</p>
            <p><strong>Size:</strong> {fileInfo.size} bytes</p>
            <p><strong>Type:</strong> {fileInfo.type}</p>
            <p><strong>Last modified:</strong> {fileInfo.lastModifiedDate}</p>
          </div>
        )}
      </div>
     
    </div>
  )
}

export default App