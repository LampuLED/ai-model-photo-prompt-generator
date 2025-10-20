import React from 'react';
import { DeleteIcon } from './icons';

interface CustomFileInputProps {
  label: string;
  currentImage: string | null;
  onDelete: () => void;
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const CustomFileInput: React.FC<CustomFileInputProps> = ({ label, currentImage, onDelete, onImageUpload }) => (
  <div className="flex flex-col space-y-2">
    <p className="text-sm font-semibold text-white">{label}</p>

    <div className="flex items-center space-x-2">
      <label htmlFor="model-image-upload" className="cursor-pointer bg-purple-700 hover:bg-purple-800 text-white font-semibold py-2 px-4 rounded-xl shadow-md transition duration-150 text-sm">
        Choose File
      </label>
      <input
        type="file"
        accept="image/*"
        onChange={onImageUpload}
        className="hidden"
        id="model-image-upload"
      />
      <span className="text-white text-sm whitespace-nowrap">
        {currentImage ? "File Chosen" : "No file chosen"}
      </span>
    </div>

    <p className="text-center text-sm font-semibold text-white mt-1">
      Character Image Preview
    </p>
    <div className={`
      relative flex items-center justify-center rounded-xl border-4 border-dashed p-2
      ${currentImage ? 'border-purple-500' : 'border-indigo-700 bg-indigo-900'}
      min-h-72
    `}>
      {currentImage ? (
        <>
          <img
            src={`data:image/jpeg;base64,${currentImage}`}
            alt={label}
            className="w-full h-full max-h-72 object-contain rounded-lg"
          />
          <button
            onClick={onDelete}
            className="absolute top-0 right-0 m-1 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg transition duration-150 z-10"
            aria-label="Delete Image"
          >
            <DeleteIcon />
          </button>
        </>
      ) : (
        <div className="text-center text-gray-400 p-4">
          <p className="text-lg font-bold">
            Upload Image
          </p>
        </div>
      )}
    </div>
  </div>
);

export default CustomFileInput;
