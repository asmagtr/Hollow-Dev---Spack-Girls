
// import axios from "axios";

// const FileCard = ({ id,title, description, type, size,onDelete}) => {
//   // Example functions for preview, modify, and delete
//   const handlePreview = async() => {
//     console.log('Preview clicked for file:', title);
//     const response=await axios.get("http://localhost:3000/get-file/"+id);
//     const fileLink=response.data.filePath;
//     window.open(fileLink, '_blank');
//   };

//   const handleModify = () => {
//     // Implement modify functionality
//     console.log('Modify clicked for file:', title);
//   };

//   const handleDelete = async() => {
    
//     console.log('Delete clicked for file:', title);
//     const response=await axios.delete("http://localhost:3000/delete-file/"+id);
//     if(response && response.data && !response.data.error){
//         await onDelete();
//         alert ("deleted");
//     }
//   };

//   return (
//     <div className="bg-blue-100 shadow-md rounded-lg p-4 mb-4">
//       <h2 className="text-xl font-bold mb-2">{title}</h2>
//       <p className="text-gray-600 mb-2">{description}</p>
//       <div className="flex justify-between items-center mb-4">
//         <div className="flex space-x-2">
//           <button
//             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//             onClick={handlePreview}
//           >
//             Preview
//           </button>
//           <button
//             className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//             onClick={handleModify}
//           >
//             Modify
//           </button>
//           <button
//             className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//             onClick={handleDelete}
//           >
//             Delete
//           </button>
//         </div>
//         <p className="text-sm text-gray-500">{formatSize(size)}</p>
//       </div>
//       <p className="text-sm text-gray-500">Type: {type}</p>
//     </div>
//   );
// };

// // Helper function to format file size (assuming size is in bytes)
// const formatSize = (bytes) => {
//   if (bytes === 0) return '0 B';
//   const k = 1024;
//   const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
//   const i = Math.floor(Math.log(bytes) / Math.log(k));
//   return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
// };

// export default FileCard;
import React, { useState } from "react";
import axios from "axios";
import Modal from "react-modal";

const FileCard = ({ id, title, description, type, size, onDelete }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modifiedTitle, setModifiedTitle] = useState(title);
  const [modifiedDescription, setModifiedDescription] = useState(description);

  const handlePreview = async () => {
    console.log("Preview clicked for file:", title);
    const response = await axios.get("http://localhost:3000/get-file/" + id);
    const fileLink = response.data.filePath;
    window.open(fileLink, "_blank");
  };

  const handleModify = () => {
    setModalIsOpen(true);
  };

  const handleDelete = async () => {
    console.log("Delete clicked for file:", title);
    const response = await axios.delete("http://localhost:3000/delete-file/" + id);
    if (response && response.data && !response.data.error) {
      await onDelete();
      alert("Deleted");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Send modified title and description to server
    try {
      const response = await axios.put(`http://localhost:3000/modify-file/${id}`, {
        title: modifiedTitle,
        description: modifiedDescription,
      });
      if (response && response.data && !response.data.error) {
        // Close modal and update UI with new title and description
        setModalIsOpen(false);
        alert("File modified successfully!");
      }
    } catch (error) {
      console.error("Error modifying file:", error);
    }
  };

  const closeModal = () => {
    setModifiedTitle(title); // Reset to original title if canceled
    setModifiedDescription(description); // Reset to original description if canceled
    setModalIsOpen(false);
  };

  return (
    <div className="bg-blue-100 shadow-md rounded-lg p-4 mb-4">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="text-gray-600 mb-2">{description}</p>
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handlePreview}
          >
            Preview
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

      {/* Modal for Modify */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        className="Modal"
        overlayClassName="Overlay"
        contentLabel="Modify File Modal"
      >
        <h2>Modify File</h2>
        <form onSubmit={handleSubmit}>
          <label>Title:</label>
          <input
            type="text"
            value={modifiedTitle}
            onChange={(e) => setModifiedTitle(e.target.value)}
          />
          <label>Description:</label>
          <textarea
            value={modifiedDescription}
            onChange={(e) => setModifiedDescription(e.target.value)}
          />
          <button type="submit">Save Changes</button>
          <button type="button" onClick={closeModal}>
            Cancel
          </button>
        </form>
      </Modal>
    </div>
  );
};

// Helper function to format file size (assuming size is in bytes)
const formatSize = (bytes) => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

export default FileCard;
