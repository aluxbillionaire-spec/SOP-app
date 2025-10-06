'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function NewSOP() {
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: upload, 2: processing, 3: complete
  const [sopId, setSopId] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setStep(2); // Processing step

    try {
      // Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('sop-files')
        .upload(fileName, file);

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('sop-files')
        .getPublicUrl(fileName);

      // Save file info to database
      const { data: fileData, error: fileError } = await supabase
        .from('files')
        .insert([
          {
            file_url: publicUrl,
            file_type: file.type,
            created_at: new Date().toISOString(),
          },
        ])
        .select();

      if (fileError) throw fileError;

      // Call API to process file
      const response = await fetch('/api/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileUrl: publicUrl,
          fileType: file.type,
          description,
        }),
      });

      if (!response.ok) throw new Error('Failed to process file');

      const result = await response.json();
      
      // Save SOP to database
      const { data: sopData, error: sopError } = await supabase
        .from('sops')
        .insert([
          {
            title: result.title,
            content: JSON.stringify({
              purpose: result.purpose,
              tools: result.tools,
              steps: result.steps,
              notes: result.notes,
            }),
            checklist: JSON.stringify(result.checklist),
            created_at: new Date().toISOString(),
          },
        ])
        .select();

      if (sopError) throw sopError;

      setSopId(sopData[0].id);
      setStep(3); // Complete step
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file. Please try again.');
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setDescription('');
    setStep(1);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New SOP</h1>
        </div>
      </header>
      <main>
        <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h2 className="text-lg leading-6 font-medium text-gray-900">
                  {step === 1 && 'Upload Content'}
                  {step === 2 && 'Processing'}
                  {step === 3 && 'Complete'}
                </h2>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  {step === 1 && 'Upload a video or document to generate your SOP'}
                  {step === 2 && 'We are analyzing your content and generating your SOP'}
                  {step === 3 && 'Your SOP has been generated successfully'}
                </p>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                {step === 1 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Upload File
                      </label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                            aria-hidden="true"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="file-upload"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                            >
                              <span>Upload a file</span>
                              <input
                                id="file-upload"
                                name="file-upload"
                                type="file"
                                className="sr-only"
                                onChange={handleFileChange}
                                ref={fileInputRef}
                                accept=".mp4,.webm,.pdf,.docx,.txt"
                              />
                            </label>
                            <p className="pl-1">or drag and drop</p>
                          </div>
                          <p className="text-xs text-gray-500">
                            MP4, WebM, PDF, DOCX, TXT up to 10MB
                          </p>
                        </div>
                      </div>
                      {file && (
                        <p className="mt-2 text-sm text-gray-500">
                          Selected: {file.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Description (Optional)
                      </label>
                      <div className="mt-1">
                        <textarea
                          id="description"
                          name="description"
                          rows={3}
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                          placeholder="Add any additional context about this process..."
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleUpload}
                        disabled={!file || loading}
                        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                      >
                        {loading ? 'Processing...' : 'Generate SOP'}
                      </button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="text-center py-8">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                      Analyzing your content
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      This may take a few moments...
                    </p>
                  </div>
                )}

                {step === 3 && (
                  <div className="text-center py-8">
                    <div className="flex justify-center">
                      <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                        <svg
                          className="h-6 w-6 text-green-600"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                      SOP Generated Successfully!
                    </h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Your Standard Operating Procedure has been created.
                    </p>
                    <div className="mt-6 flex justify-center space-x-4">
                      <button
                        onClick={handleReset}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Create Another
                      </button>
                      <button
                        onClick={() => router.push(`/sop/${sopId}`)}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        View SOP
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}