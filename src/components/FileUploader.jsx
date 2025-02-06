import { useState } from "react";
import { FaCloudUploadAlt, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const FileUploader = () => {
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});

  const handleFileChange = (event) => {
    const newFiles = [...event.target.files];
    setFiles([...files, ...newFiles]);
    simulateUpload(newFiles);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const newFiles = [...event.dataTransfer.files];
    setFiles([...files, ...newFiles]);
    simulateUpload(newFiles);
  };

  const simulateUpload = (newFiles) => {
    newFiles.forEach((file) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress((prev) => ({ ...prev, [file.name]: progress }));
        if (progress >= 100) clearInterval(interval);
      }, 500);
    });
  };

  return (
    
      <div
        className="px-10 py-8 rounded-lg  w-96 text-center "
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <div className="border-2 border-dashed border-gray-300 px-14 py-10 rounded-lg">
          <FaCloudUploadAlt className="text-blue-500 text-4xl mx-auto" />
          <p className="text-gray-500 mt-2">Drag and drop files here</p>
          <p className="text-gray-400 my-3 text-lg font-medium ">or</p>
          <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded">
            Browse files
            <input type="file" multiple className="hidden" onChange={handleFileChange} />
          </label>
        </div>


        <div className="mt-4 space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded">
              <p className="text-sm text-gray-700 truncate w-40">{file.name}</p>
              {uploadProgress[file.name] < 100 ? (
                <p className="text-blue-500 text-sm">{uploadProgress[file.name]}%</p>
              ) : (
                <FaCheckCircle className="text-green-500" />
              )}
            </div>
          ))}
        </div>
      </div>
    
  );
};

export default FileUploader;
