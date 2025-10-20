import React, { useState, useEffect } from 'react';
import { promptOptions, topDropdowns, middleDropdowns, bottomDropdown } from './constants';
import { generatePromptFromApi, generateImageFromPrompt } from './services/geminiService';
import { SelectedOptions, ReferenceImage } from './types';
import OptionDropdown from './components/OptionDropdown';
import CustomFileInput from './components/CustomFileInput';
import ReferenceImageInput from './components/ReferenceImageInput';
import { CopyIcon, SpinnerIcon, ImageIcon, DownloadIcon } from './components/icons';

const App: React.FC = () => {
  const [uploadedModelImage, setUploadedModelImage] = useState<string | null>(null);
  const [additionalDescription, setAdditionalDescription] = useState<string>('');
  const [promptResult, setPromptResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // State for image generation setup
  const [imageGenerationPrompt, setImageGenerationPrompt] = useState<string>('');
  const [referenceImages, setReferenceImages] = useState<ReferenceImage[]>([]);

  // State for image generation result
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);
  const [imageGenerationError, setImageGenerationError] = useState<string | null>(null);

  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>(
    Object.keys(promptOptions).reduce((acc, key) => {
      acc[key] = promptOptions[key][0];
      return acc;
    }, {} as SelectedOptions)
  );
  
  useEffect(() => {
    setImageGenerationPrompt(promptResult);
  }, [promptResult]);

  const clearImageGenerationState = () => {
    setGeneratedImage(null);
    setImageGenerationError(null);
    setReferenceImages([]);
    setImageGenerationPrompt('');
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = (reader.result as string).split(',')[1];
        setUploadedModelImage(base64Data);
        setPromptResult('');
        setError(null);
        clearImageGenerationState();
      };
      reader.readAsDataURL(file);
    } else {
      setUploadedModelImage(null);
      setError("Please upload a valid image file (JPEG, PNG).");
    }
    event.target.value = '';
  };

  const handleImageDelete = () => {
    setUploadedModelImage(null);
    setPromptResult('');
    setError(null);
    clearImageGenerationState();
  };
  
  const handleOptionChange = (key: string, value: string) => {
    setSelectedOptions(prev => ({ ...prev, [key]: value }));
  };

  const handleCopyPrompt = async () => {
    if (!promptResult) return;
    try {
      await navigator.clipboard.writeText(promptResult);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };
  
  const handleReferenceImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && referenceImages.length < 2) { // Limit to 2
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = (reader.result as string).split(',')[1];
        setReferenceImages(prev => [...prev, { id: crypto.randomUUID(), data: base64Data }]);
      };
      reader.readAsDataURL(file);
    }
    event.target.value = ''; 
  };

  const handleReferenceImageDelete = (id: string) => {
    setReferenceImages(prev => prev.filter(img => img.id !== id));
  };


  const handleSubmitPrompt = async () => {
    if (!uploadedModelImage) {
      setError("Please upload the Main Model Image.");
      return;
    }

    setIsLoading(true);
    setPromptResult('');
    setError(null);
    clearImageGenerationState();

    const customDetails = Object.entries(selectedOptions)
      .filter(([key, value]) => value !== promptOptions[key][0])
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');

    const extraDetails = additionalDescription ? ` [ADDITIONAL TEXT DESCRIPTION]: ${additionalDescription}.` : '';
    
    try {
      const generatedText = await generatePromptFromApi(uploadedModelImage, customDetails, extraDetails);
      if (generatedText) {
        setPromptResult(generatedText.trim());
      } else {
        setError("Failed to generate prompt. Invalid API response.");
      }
    } catch (e: any) {
      console.error("Error during prompt generation:", e);
      setError(e.message || "An error occurred while contacting the AI service. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGenerateImage = async () => {
    let baseImagesForGeneration: string[] = referenceImages.map(img => img.data);
    
    if (baseImagesForGeneration.length === 0 && uploadedModelImage) {
        baseImagesForGeneration.push(uploadedModelImage);
    }

    if (!imageGenerationPrompt) {
        setImageGenerationError("Cannot generate image without a prompt.");
        return;
    }
    if (baseImagesForGeneration.length === 0) {
        setImageGenerationError("A base image is required. Please upload a Character Model Image or a Reference Image.");
        return;
    }

    setIsGeneratingImage(true);
    setImageGenerationError(null);
    setGeneratedImage(null);

    try {
        const imageB64 = await generateImageFromPrompt(imageGenerationPrompt, baseImagesForGeneration);
        setGeneratedImage(imageB64);
    } catch (e: any) {
        console.error("Error during image generation:", e);
        setImageGenerationError(e.message || "An error occurred while generating the image.");
    } finally {
        setIsGeneratingImage(false);
    }
  };

  const handleDownloadImage = () => {
    if (!generatedImage) return;

    const link = document.createElement('a');
    link.href = `data:image/png;base64,${generatedImage}`;
    link.download = `generated-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const hasBaseImage = !!(uploadedModelImage || referenceImages.length > 0);

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-white mb-1">
            AI Model Photo Prompt Generator
          </h1>
          <p className="text-lg text-indigo-400">
            Create your desired AI image prompt, ready for customization.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-indigo-950 p-6 sm:p-8 rounded-3xl shadow-2xl border-4 border-indigo-700 space-y-6">
            <h2 className="text-2xl font-bold text-white">1. Upload Image &amp; Select Options</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <CustomFileInput
                  label="Character Model Image (Required)"
                  currentImage={uploadedModelImage}
                  onDelete={handleImageDelete}
                  onImageUpload={handleImageUpload}
                />
              </div>

              <div className="md:col-span-1 flex flex-col space-y-3">
                {topDropdowns.map(key => (
                  <OptionDropdown
                    key={key}
                    title={key}
                    options={promptOptions[key]}
                    selectedValue={selectedOptions[key]}
                    onChange={handleOptionChange}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {middleDropdowns.map(key => (
                <OptionDropdown
                  key={key}
                  title={key}
                  options={promptOptions[key]}
                  selectedValue={selectedOptions[key]}
                  onChange={handleOptionChange}
                />
              ))}
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="col-span-1">
                <OptionDropdown
                  key={bottomDropdown}
                  title={bottomDropdown}
                  options={promptOptions[bottomDropdown]}
                  selectedValue={selectedOptions[bottomDropdown]}
                  onChange={handleOptionChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-semibold text-white">Additional Description (Optional, free text)</p>
              <textarea
                value={additionalDescription}
                onChange={(e) => setAdditionalDescription(e.target.value)}
                rows={3}
                placeholder={`Example: "The character has long, flowing silver hair, wearing a high-tech exoskeleton suit" or "The mood should be melancholic."`}
                className="w-full p-4 border border-indigo-700 bg-indigo-900 text-white rounded-xl shadow-inner focus:ring-purple-400 focus:border-purple-400 transition duration-150 resize-y"
              />
            </div>

            <button
              onClick={handleSubmitPrompt}
              disabled={isLoading || !uploadedModelImage}
              className={`w-full py-4 px-6 text-lg font-bold rounded-xl shadow-lg transition duration-300 ease-in-out flex items-center justify-center ${
                isLoading || !uploadedModelImage
                  ? 'bg-gray-600 cursor-not-allowed text-gray-300'
                  : 'bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-black transform hover:scale-[1.01]'
              }`}
            >
              {isLoading ? (
                <>
                  <SpinnerIcon />
                  GENERATING & CUSTOMIZING...
                </>
              ) : (
                'GENERATE & CUSTOMIZE PROMPT'
              )}
            </button>
          </div>

          <div className="bg-indigo-950 p-6 sm:p-8 rounded-3xl shadow-2xl border-4 border-indigo-700 space-y-4 flex flex-col">
            {/* Section 2: Prompt Result */}
            <div>
              <h2 className="text-2xl font-bold text-white">2. AI Prompt Result</h2>
              <div className="p-4 bg-indigo-900 border border-indigo-700 rounded-xl text-gray-400 my-4 text-sm">
                The prompt from your selections will appear here. Copy it or use the tools below to generate an image directly.
              </div>
              
              {error && (
                <div className="p-3 bg-red-800 border border-red-600 text-white rounded-lg mb-4" role="alert">
                  <p className="font-bold">Error:</p>
                  <p>{error}</p>
                </div>
              )}
              
              <div className="flex items-center justify-between mb-2">
                <button
                  onClick={handleCopyPrompt}
                  disabled={!promptResult}
                  className={`py-2 px-4 rounded-xl font-semibold text-sm transition duration-150 flex items-center space-x-2 ${
                    !promptResult
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 text-white shadow-md'
                  }`}
                >
                  <CopyIcon />
                  <span>Copy Prompt</span>
                </button>
                {isCopied && (
                  <span className="text-sm font-semibold text-green-400 bg-gray-800 p-2 rounded-lg transition duration-300 animate-pulse">
                    🎉 Copied!
                  </span>
                )}
              </div>

              <textarea
                readOnly
                value={promptResult}
                placeholder="The final prompt will appear here..."
                className="w-full h-28 p-4 bg-gray-800 border border-gray-700 rounded-lg text-white font-mono text-sm resize-none focus:outline-none"
              />
            </div>

            <div className="border-t-2 border-indigo-800 my-1"></div>
            
            {/* Section 3: Image Generation */}
            <div className="flex-grow flex flex-col space-y-4">
              <h2 className="text-2xl font-bold text-white">3. Image Generation</h2>
              
              {/* Setup Area */}
              <div className="space-y-4 p-4 bg-indigo-900 rounded-xl border border-indigo-700">
                <div>
                  <label htmlFor="image-prompt-textarea" className="text-sm font-semibold text-white">Editable Prompt</label>
                  <textarea
                    id="image-prompt-textarea"
                    value={imageGenerationPrompt}
                    onChange={(e) => setImageGenerationPrompt(e.target.value)}
                    disabled={!promptResult}
                    placeholder="Edit your prompt here before generating..."
                    className="mt-1 w-full h-24 p-2 bg-gray-800 border border-gray-700 rounded-lg text-white font-mono text-sm resize-y focus:outline-none focus:ring-1 focus:ring-purple-400 disabled:bg-gray-900 disabled:text-gray-500"
                  />
                </div>
                <ReferenceImageInput 
                  images={referenceImages}
                  onImageUpload={handleReferenceImageUpload}
                  onImageDelete={handleReferenceImageDelete}
                  maxImages={2}
                />
              </div>

              {/* Action and Result Area */}
              <div>
                  <button
                      onClick={handleGenerateImage}
                      disabled={!imageGenerationPrompt || isGeneratingImage || isLoading || !hasBaseImage}
                      className={`w-full md:w-auto py-2 px-4 rounded-xl font-semibold text-sm transition duration-150 flex items-center justify-center space-x-2 ${
                          !imageGenerationPrompt || isGeneratingImage || isLoading || !hasBaseImage
                          ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                          : 'bg-purple-600 hover:bg-purple-700 text-white shadow-md'
                      }`}
                  >
                      {isGeneratingImage ? <SpinnerIcon /> : <ImageIcon />}
                      <span>
                          {isGeneratingImage ? 'Generating...' : 'Generate Image'}
                      </span>
                  </button>
              </div>

              {imageGenerationError && (
                  <div className="p-3 bg-red-800 border border-red-600 text-white rounded-lg" role="alert">
                      <p className="font-bold">Image Generation Error:</p>
                      <p>{imageGenerationError}</p>
                  </div>
              )}

              <div className="relative flex-grow flex items-center justify-center rounded-xl border-4 border-dashed border-indigo-700 bg-indigo-900 min-h-60 p-2">
                  {isGeneratingImage ? (
                      <div className="text-center text-gray-400 p-4 flex flex-col items-center">
                          <SpinnerIcon />
                          <p className="mt-2 font-semibold">Generating your image...</p>
                      </div>
                  ) : generatedImage ? (
                      <>
                          <img
                              src={`data:image/png;base64,${generatedImage}`}
                              alt="Generated by AI"
                              className="w-full h-full object-contain rounded-lg"
                          />
                          <button
                            onClick={handleDownloadImage}
                            className="absolute top-2 right-2 p-2 bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg transition duration-150 z-10"
                            aria-label="Download Image"
                            title="Download Image"
                          >
                            <DownloadIcon />
                          </button>
                      </>
                  ) : (
                      <div className="text-center text-gray-400 p-4">
                          <p className="text-lg font-bold">Image will appear here</p>
                      </div>
                  )}
              </div>
            </div>
          </div>
        </div>
        <footer className="text-center mt-12 py-6 border-t border-indigo-800">
          <h3 className="text-lg font-semibold text-white mb-4">Connect with KAKABASTARI</h3>
          <div className="flex items-center justify-center space-x-6">
            <a href="https://www.instagram.com/kakabastari/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition duration-300" aria-label="Instagram">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.85s-.011 3.584-.069 4.85c-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07s-3.584-.012-4.85-.07c-3.252-.148-4.771-1.691-4.919-4.919-.058-1.265-.069-1.645-.069-4.85s.011-3.584.069-4.85c.149-3.225 1.664-4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163m0-2.163C8.74 0 8.333.011 7.053.069 2.59.285.285 2.59.069 7.053.011 8.333 0 8.74 0 12s.011 3.667.069 4.947c.216 4.46 2.521 6.765 6.984 6.984 1.27.058 1.67.069 4.947.069s3.677-.011 4.947-.069c4.46-.216 6.765-2.521 6.984-6.984.058-1.27.069-1.67.069-4.947s-.011-3.667-.069-4.947C21.715 2.59 19.41.285 14.947.069 13.667.011 13.26 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.88 1.44 1.44 0 000-2.88z" />
              </svg>
            </a>
            <a href="https://www.youtube.com/@kakabastari" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition duration-300" aria-label="YouTube">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21.582,6.186c-0.23-0.854-0.908-1.532-1.762-1.762C18.254,4,12,4,12,4S5.746,4,4.18,4.424 c-0.854,0.23-1.532,0.908-1.762,1.762C2,7.754,2,12,2,12s0,4.246,0.418,5.814c0.23,0.854,0.908,1.532,1.762,1.762 C5.746,20,12,20,12,20s6.254,0,7.82-0.424c0.854-0.23,1.532-0.908,1.762-1.762C22,16.246,22,12,22,12S22,7.754,21.582,6.186z M10,15.464V8.536L16,12L10,15.464z" />
              </svg>
            </a>
             <a href="https://www.facebook.com/@harry.kakabastari" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition duration-300" aria-label="YouTube">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                  </svg>
            </a>
            <a href="https://www.tiktok.com/@kakabastari" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition duration-300" aria-label="YouTube">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16.6 5.82s.51.5 0 0A4.27 4.27 0 0 1 15.54 3a4.27 4.27 0 0 1-1.06-2.06C14.48 1 12.52 1 12.52 1v10.59a2.39 2.39 0 0 1-2.39 2.39A2.39 2.39 0 0 1 7.74 11.6a2.39 2.39 0 0 1 2.39-2.39c.2 0 .39.02.58.06v-2.4a4.8 4.8 0 0 0-4.8 4.8 4.8 4.8 0 0 0 4.8 4.8 4.8 4.8 0 0 0 4.8-4.8V5.82z" />
                  </svg>
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;