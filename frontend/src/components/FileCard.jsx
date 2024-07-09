
import axios from "axios";
import { useEffect,useState } from "react";

const FileCard = ({ id,title, description,onDelete,files,setFiles,filesUpdated,setFilesUpdated,onClicking}) => {
    const [type,setType]=useState("");
    const [size,setSize]=useState(null);

    const [isOpen, setIsOpen] = useState(false); // State for modal visibility
    const [formData, setFormData] = useState({ title, description }); // State for form data
  




//load other files info 
useEffect(()=>{
    const getInfo= async()=>{
        const response= await axios.get("http://localhost:3000/get-file-info/"+id);
        if(response){
            setType(response.data.fileInfo.type);
            setSize(response.data.fileInfo.size);

        }
    };

    getInfo();
},[])

  // Example functions for preview, modify, and delete
  const handlePreview = async() => {
    const response=await axios.get("http://localhost:3000/get-file/"+id);
    const fileLink=response.data.filePath;
    window.open(fileLink, '_blank');
  };

  const handleModify = () => {
    setIsOpen(true)
  };

  const handleDelete = async() => {
    
    const response=await axios.delete("http://localhost:3000/delete-file/"+id);
    if(response && response.data && !response.data.error){
        await onDelete();
        alert ("deleted");
    }
  };

  const handleSubmit= async()=>{
    try{
        const response= await axios.put("http://localhost:3000/update-file/"+id,formData);
        if(!response){
            console,log("erroe");
            return;
        }
        const newFile=response.data.file;
        const newFileid=newFile._id;
        setFiles(files.map(file => {
            if(file._id ===newFileid){
                file.title=newFile.title;
                file.description=newFile.description;
            }
            return file;
        }));
          setFilesUpdated(filesUpdated+1);


        return;
    }catch(error){
        console.log("error");
    }

  }


  const handleCloseModal = () => {
    setIsOpen(false); // Close the modal
  };

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  return (
    <div>
    <div className="bg-blue-100 shadow-md rounded-lg p-4 mb-4" >
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-gray-600 mb-2">{description}</p>
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handlePreview}
          >
            Preview in Server
          </button>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={onClicking}
          >
            Preview in Cloudinary
          </button>
          <button
            className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleModify}
          >
            Modify
          </button>
          <button
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleDelete}
          >
            Delete
          </button>
        </div>
        <p className="text-sm text-gray-500">{formatSize(size)}</p>
      </div>
      <p className="text-sm text-gray-500">Type: {type}</p>
    </div>

    {isOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-2">Modify File</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-gray-700 font-bold mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="block text-gray-700 font-bold mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ">
                    update
                  </button>
                  </div>
                  </form>
                  </div>
                  </div>
    )}

    </div>
    
  );
};

// Helper function to format file size (assuming size is in bytes)
const formatSize = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export default FileCard;