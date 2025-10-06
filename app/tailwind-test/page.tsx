export default function TailwindTest() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Tailwind CSS Test</h1>
        <p className="text-gray-600 mb-6">If you can see this styled correctly, Tailwind CSS is working!</p>
        <div className="flex space-x-4">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
            Primary Button
          </button>
          <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
            Secondary Button
          </button>
        </div>
        <div className="mt-6">
          <div className="bg-gray-200 rounded-full h-2.5">
            <div className="bg-indigo-600 h-2.5 rounded-full animate-progress" style={{ width: '75%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}