import { useState } from "react";
import { FaCheck } from "react-icons/fa";

const CopyToClipboard = ({quizID}) => {

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(quizID.quizId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-8 gap-2 w-full max-w-[23rem] ">
      <input
        type="text"
        className="col-span-6 bg-gray-50 border border-gray-300 text-white text-sm rounded-md md:rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-black dark:border-gray-600  dark:focus:ring-blue-500 dark:focus:border-blue-500"
        value={quizID.quizId}
        disabled
        readOnly
      />
      <button
        onClick={handleCopy}
        className="col-span-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-2 focus:outline-none focus:ring-blue-300 font-medium rounded-md md:rounded-lg text-sm w-full  text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 flex items-center justify-center"
      >
        {copied ? (
          <span className="flex items-center gap-1">
            <FaCheck className="w-3 h-3 text-white" /> Copied!
          </span>
        ) : (
          "Copy"
        )}
      </button>
    </div>
  );
};

export default CopyToClipboard;