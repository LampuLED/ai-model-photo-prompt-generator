import React from 'react';
import { AddIcon, DeleteIcon } from './icons';
import { ReferenceImage } from '../types';

interface ReferenceImageInputProps {
  images: ReferenceImage[];
  onImageUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onImageDelete: (id: string) => void;
  maxImages: number;
}

const ReferenceImageInput: React.FC<ReferenceImageInputProps> = ({ images, onImageUpload, onImageDelete, maxImages }) => {
  const canUpload = images.length < maxImages;

  return (
    <div className="space-y-3">
      <div>
        <label className="text-sm font-semibold text-white">Base Images (Optional)</label>
        <p className="text-xs text-gray-400">Add up to 2 images to act as a base for generation. This will override the main character image.</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {images.map((image) => (
          <div key={image.id} className="relative group">
            <img
              src={`data:image/jpeg;base64,${image.data}`}
              alt="Reference"
              className="w-full h-24 object-cover rounded-lg border-2 border-indigo-600"
            />
            <button
              onClick={() => onImageDelete(image.id)}
              className="absolute top-1 right-1 p-1 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg transition duration-150 opacity-0 group-hover:opacity-100"
              aria-label="Delete Reference Image"
            >
              <DeleteIcon />
            </button>
          </div>
        ))}
        {canUpload && (
          <label
            htmlFor="reference-image-upload"
            className="flex flex-col items-center justify-center w-full h-24 p-2 border-2 border-dashed border-indigo-700 hover:border-purple-500 bg-indigo-900 rounded-lg cursor-pointer transition"
          >
            <AddIcon />
            <span className="text-xs text-gray-400 mt-1 text-center">Add Image</span>
            <input
              id="reference-image-upload"
              type="file"
              accept="image/*"
              onChange={onImageUpload}
              className="hidden"
            />
          </label>
        )}
      </div>
    </div>
  );
};

export default ReferenceImageInput;