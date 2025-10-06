'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">OpsPilot</h1>
          <p className="mt-2 text-gray-600">AI-Powered SOP Generator for Small Businesses</p>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Create Professional SOPs in Minutes</h2>
              <p className="text-gray-600 mb-6">
                Upload a video or document and let our AI transform it into a structured Standard Operating Procedure.
              </p>
              <Link href="/dashboard">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
                  Get Started
                </button>
              </Link>
            </div>
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">1. Upload Content</h3>
                <p className="text-gray-600">Upload a video (MP4, WebM, Loom) or document (PDF, DOCX, TXT) describing your process.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">2. AI Processing</h3>
                <p className="text-gray-600">Our AI transcribes videos and extracts text from documents to understand your process.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">3. Get Your SOP</h3>
                <p className="text-gray-600">Receive a professionally formatted SOP with step-by-step instructions and checklist.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}