'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
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
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <div className="bg-indigo-600 text-white font-bold text-xl p-2 rounded-lg">OP</div>
              <span className="ml-2 text-xl font-semibold text-gray-900">OpsPilot</span>
            </div>
            <nav className="flex space-x-8">
              <Link href="/dashboard" className="text-gray-900 font-medium">Dashboard</Link>
              <Link href="/new" className="text-indigo-600 font-medium">New SOP</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Create New SOP</h1>
            <p className="mt-2 text-gray-600">Upload a video or document to generate your Standard Operating Procedure</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Progress Indicator */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center">
                <div className={`flex items-center ${step >= 1 ? 'text-indigo-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-indigo-100' : 'bg-gray-100'}`}>
                    1
                  </div>
                  <span className="ml-2 font-medium">Upload</span>
                </div>
                <div className={`flex-1 h-0.5 mx-4 ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
                <div className={`flex items-center ${step >= 2 ? 'text-indigo-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-indigo-100' : 'bg-gray-100'}`}>
                    2
                  </div>
                  <span className="ml-2 font-medium">Processing</span>
                </div>
                <div className={`flex-1 h-0.5 mx-4 ${step >= 3 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
                <div className={`flex items-center ${step >= 3 ? 'text-indigo-600' : 'text-gray-400'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-indigo-100' : 'bg-gray-100'}`}>
                    3
                  </div>
                  <span className="ml-2 font-medium">Complete</span>
                </div>
              </div>
            </div>

            <div className="px-6 py-8">
              {step === 1 && (
                <div className="space-y-8">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Upload Content</h2>
                    <p className="text-gray-600">Upload a video or document to generate your SOP</p>
                  </div>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors duration-300">
                    <div className="flex justify-center">
                      <div className="bg-indigo-100 p-3 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h3 className="text-lg font-medium text-gray-900">Upload a file</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        MP4, WebM, PDF, DOCX, TXT up to 10MB
                      </p>
                    </div>
                    <div className="mt-6">
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        accept=".mp4,.webm,.pdf,.docx,.txt"
                      />
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Select File
                      </label>
                      <p className="mt-2 text-sm text-gray-500">
                        or drag and drop files anywhere in this box
                      </p>
                    </div>
                    {file && (
                      <div className="mt-4 flex items-center justify-center text-sm text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Selected: {file.name}
                      </div>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Description (Optional)
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="description"
                        name="description"
                        rows={4}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-lg p-3"
                        placeholder="Add any additional context about this process..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                    <p className="mt-2 text-sm text-gray-500">
                      Provide any extra details that might help improve the accuracy of your SOP
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleUpload}
                      disabled={!file || loading}
                      className="ml-3 inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        'Generate SOP'
                      )}
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="text-center py-12">
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-600 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <h3 className="mt-6 text-2xl font-bold text-gray-900">Analyzing your content</h3>
                  <p className="mt-2 text-gray-600 max-w-md mx-auto">
                    Our AI is processing your file and generating your Standard Operating Procedure. This may take a few moments...
                  </p>
                  <div className="mt-8 max-w-md mx-auto">
                    <div className="bg-gray-200 rounded-full h-2.5">
                      <div className="bg-indigo-600 h-2.5 rounded-full animate-progress" style={{ width: '75%' }}></div>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">Processing... 75%</div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="text-center py-12">
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <h3 className="mt-6 text-2xl font-bold text-gray-900">SOP Generated Successfully!</h3>
                  <p className="mt-2 text-gray-600 max-w-md mx-auto">
                    Your Standard Operating Procedure has been created and is ready to view.
                  </p>
                  <div className="mt-8 flex justify-center space-x-4">
                    <button
                      onClick={handleReset}
                      className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Create Another
                    </button>
                    <button
                      onClick={() => router.push(`/sop/${sopId}`)}
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      View SOP
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}