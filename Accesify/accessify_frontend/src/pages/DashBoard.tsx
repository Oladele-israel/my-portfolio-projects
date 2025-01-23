import React from "react";
import { useState } from "react";
const DashBoard = () => {
  const [link, setLink] = useState<string>("");
  const [isValidLink, setIsValidLink] = useState<boolean | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLink(e.target.value);
  };

  const validateLink = () => {
    // Simulate link validation
    const isValid = link.startsWith("https://drive.google.com/");
    setIsValidLink(isValid);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      alert(`Uploading file: ${files[0].name}`);
      // Handle file upload logic here
    }
  };
  return (
    <div className="relative  h-screen w-screen text-white">
      {/* Overlay */}
      {/* <div className="absolute inset-0 bg-white opacity-5 z-10" /> */}

      {/* Content */}
      <div className="relative z-20 p-4">
        {/* paste a link or drop a file */}
        <div className="h-screen flex flex-col items-center justify-center p-4">
          {/* Header */}
          <header className="text-center ">
            <h1 className="text-3xl font-bold text-white">File Duplication</h1>
            <p className="text-gray-200 mt-2 mb-3">
              Simplify file duplication & sharing
            </p>
          </header>

          {/* Upload Section */}
          <div
            className={`w-full max-w-md p-8 bg-[#0a2f2b] rounded-lg shadow-sm border-2 border-dashed mt-3 ${
              isDragging ? "border-blue-500" : "border-gray-300"
            } transition-colors duration-200`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="text-center ">
              <svg
                className="mx-auto h-12 w-12 text-gray-200"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
              <p className="mt-2 text-gray-200">Drag & Drop Files Here</p>
              <p className="text-sm text-gray-200">OR</p>
              <button className="mt-2 px-4 py-2 bg-blue-50 text-black rounded-lg hover:bg-blue-100 transition-colors">
                Browse Files
              </button>
            </div>
          </div>

          {/* Paste Link Section */}
          <div className="w-full  mt-8">
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <input
                type="text"
                value={link}
                onChange={handleLinkChange}
                placeholder="Paste Google Drive Link Here"
                className="flex-1 px-4 py-2 outline-none bg-transparent"
              />
              <button
                onClick={validateLink}
                className="px-4 py-2 bg-[#0a2f2b] text-white hover:bg-[#1e655e] transition-colors"
              >
                Validate & Duplicate
              </button>
            </div>
            {isValidLink !== null && (
              <p
                className={`mt-2 text-sm ${
                  isValidLink ? "text-green-600" : "text-red-600"
                }`}
              >
                {isValidLink
                  ? "Link Validated. Ready to Duplicate!"
                  : "Invalid Link. Please Try Again."}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
