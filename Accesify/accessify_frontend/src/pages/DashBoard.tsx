import React, { useState } from "react";
import { FileCog, Trash, Forward } from "lucide-react";
import Modal from "../components/DashbaordComponent/Modal";

const DashBoard: React.FC = () => {
  const [link, setLink] = useState<string>("");
  const [isValidLink, setIsValidLink] = useState<boolean | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // for the modal
  const [isSettingsModalOpen, setSettingsModalOpen] = useState<boolean>(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [isForwardModalOpen, setForwardModalOpen] = useState<boolean>(false);

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
    <div className="relative w-screen text-white lg:w-[100vw] pb-24">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-white opacity-5" />

      {/* Content */}
      <div className="relative p-1s lg:mr-20 pt-10">
        {/* paste a link or drop a file */}
        <div className="h-screen flex flex-col items-center justify-center p-4">
          {/* Header */}
          <header className="text-center">
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
            <div className="text-center">
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
          <div className="w-full lg:w-[60vw] mt-8">
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <input
                type="text"
                value={link}
                onChange={handleLinkChange}
                placeholder="Paste Google Drive Link"
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

          {/* the link display */}
          <div className="mt-10 flex flex-col gap-4 w-full ">
            <div className="border rounded-md p-2 w-36 text-center capitalize hover:bg-[#0a2f2b]">
              new collection
            </div>
            <div className="w-full bg-black p-3 border border-slate-500 rounded-md ">
              <div className="flex flex-col gap-1">
                <div className="flex justify-between">
                  <span className="font-bold">title:</span>
                  <span className="mr-20">jobOffer.dir</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-bold">original url:</span>
                  <span className="mr-10">googledrive@lonk.com</span>
                </div>
                <div>
                  <div className="flex justify-between">
                    <span className="font-bold">duplicate url:</span>
                    <span className="mr-10">googledrive@lonk.com</span>
                  </div>
                  <div className="bg-[#0a2f2b] mt-3 flex items-center justify-center justify-between p-2">
                    <FileCog
                      onClick={() => setSettingsModalOpen(true)}
                      className="cursor-pointer"
                    />
                    <Trash
                      onClick={() => setDeleteModalOpen(true)}
                      className="cursor-pointer"
                    />
                    <Forward
                      onClick={() => setForwardModalOpen(true)}
                      className="cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={isSettingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
      >
        <h2>File Settings</h2>
        <p>Here you can configure the settings for the file.</p>
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
      >
        <h2>Delete File</h2>
        <p>Are you sure you want to delete this file?</p>
        <button
          onClick={() => {
            /* Handle delete logic */
          }}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Delete
        </button>
      </Modal>

      <Modal
        isOpen={isForwardModalOpen}
        onClose={() => setForwardModalOpen(false)}
      >
        <h2>Forward File</h2>
        <p>Choose where to forward this file.</p>
        <button
          onClick={() => {
            /* Handle forward logic */
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Forward
        </button>
      </Modal>
    </div>
  );
};

export default DashBoard;
