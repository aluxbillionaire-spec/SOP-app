'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <div className="bg-indigo-600 text-white font-bold text-xl p-2 rounded-lg">OP</div>
              <span className="ml-2 text-xl font-semibold text-gray-900">OpsPilot</span>
            </div>
            <div className="flex space-x-4">
              <Link href="/login" className="text-gray-600 hover:text-gray-900 font-medium">
                Log in
              </Link>
              <Link href="/signup" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6">
              Transform Videos into
              <span className="block text-indigo-600">Professional SOPs</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              Upload any video or document and let AI generate structured Standard Operating Procedures for your team in seconds.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/signup">
                <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300 shadow-lg hover:shadow-xl">
                  Get Started Free
                </button>
              </Link>
              <Link href="/dashboard">
                <button className="bg-white hover:bg-gray-50 text-gray-900 font-bold py-3 px-8 rounded-lg text-lg transition duration-300 border border-gray-300">
                  View Demo
                </button>
              </Link>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Video to Text</h3>
              <p className="text-gray-600">
                Upload training videos and automatically convert them to text with our AI-powered transcription.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">AI-Powered SOPs</h3>
              <p className="text-gray-600">
                Our advanced AI transforms your content into structured, professional Standard Operating Procedures.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Export & Share</h3>
              <p className="text-gray-600">
                Download as PDF or export directly to Notion for seamless integration with your workflow.
              </p>
            </div>
          </div>

          {/* How It Works */}
          <div className="mt-24">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">How It Works</h2>
            <div className="relative">
              {/* Line connecting steps */}
              <div className="hidden md:block absolute left-1/2 top-16 bottom-16 w-0.5 bg-gray-200 transform -translate-x-1/2"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Step 1 */}
                <div className="md:col-start-1 md:row-start-1">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">1</div>
                    <div className="ml-6">
                      <h3 className="text-xl font-semibold text-gray-900">Upload Content</h3>
                      <p className="mt-2 text-gray-600">
                        Upload a training video (MP4, WebM) or document (PDF, DOCX, TXT) that describes your process.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Step 2 */}
                <div className="md:col-start-2 md:row-start-1 md:pl-12">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">2</div>
                    <div className="ml-6">
                      <h3 className="text-xl font-semibold text-gray-900">AI Processing</h3>
                      <p className="mt-2 text-gray-600">
                        Our AI transcribes videos and extracts text from documents to understand your process.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Step 3 */}
                <div className="md:col-start-1 md:row-start-2">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">3</div>
                    <div className="ml-6">
                      <h3 className="text-xl font-semibold text-gray-900">Generate SOP</h3>
                      <p className="mt-2 text-gray-600">
                        Receive a professionally formatted SOP with step-by-step instructions and checklist.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Step 4 */}
                <div className="md:col-start-2 md:row-start-2 md:pl-12">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg">4</div>
                    <div className="ml-6">
                      <h3 className="text-xl font-semibold text-gray-900">Edit & Export</h3>
                      <p className="mt-2 text-gray-600">
                        Customize your SOP and export to PDF or Notion for your team to use.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-24 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to streamline your operations?</h2>
            <p className="text-xl text-indigo-100 max-w-2xl mx-auto mb-8">
              Join thousands of small businesses creating professional SOPs in minutes, not hours.
            </p>
            <Link href="/signup">
              <button className="bg-white text-indigo-600 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg text-lg transition duration-300 shadow-lg">
                Start Free Trial
              </button>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center">
                <div className="bg-indigo-600 text-white font-bold text-xl p-2 rounded-lg">OP</div>
                <span className="ml-2 text-xl font-semibold text-gray-900">OpsPilot</span>
              </div>
              <p className="mt-4 text-gray-600">
                AI-powered SOP generation for small businesses.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Features</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Pricing</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Templates</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Integrations</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Documentation</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Tutorials</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Blog</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-gray-900">About</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Careers</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Contact</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200 text-center text-gray-600">
            <p>© 2025 OpsPilot. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}