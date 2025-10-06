'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';

interface SOPContent {
  purpose: string;
  tools: string;
  steps: string[];
  notes: string;
}

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export default function SOPViewer({ params }: { params: Promise<{ id: string }> }) {
  const [sop, setSop] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState<SOPContent>({
    purpose: '',
    tools: '',
    steps: [''],
    notes: '',
  });
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchSOP = async () => {
      // Resolve the params promise
      const resolvedParams = await params;
      
      const { data, error } = await supabase
        .from('sops')
        .select('*')
        .eq('id', resolvedParams.id)
        .single();

      if (error) {
        console.error('Error fetching SOP:', error);
      } else {
        setSop(data);
        setTitle(data.title);
        
        const parsedContent = JSON.parse(data.content);
        setContent({
          purpose: parsedContent.purpose || '',
          tools: parsedContent.tools || '',
          steps: parsedContent.steps || [''],
          notes: parsedContent.notes || '',
        });
        
        const parsedChecklist = JSON.parse(data.checklist || '[]');
        setChecklist(
          parsedChecklist.map((item: string, index: number) => ({
            id: `item-${index}`,
            text: item,
            completed: false,
          }))
        );
      }
      setLoading(false);
    };

    fetchSOP();
  }, [params]);

  const handleSave = async () => {
    // Resolve the params promise
    const resolvedParams = await params;
    
    const { error } = await supabase
      .from('sops')
      .update({
        title,
        content: JSON.stringify(content),
        checklist: JSON.stringify(checklist.map(item => item.text)),
      })
      .eq('id', resolvedParams.id);

    if (error) {
      console.error('Error updating SOP:', error);
    } else {
      setEditing(false);
    }
  };

  const handleAddStep = () => {
    setContent({
      ...content,
      steps: [...content.steps, ''],
    });
  };

  const handleStepChange = (index: number, value: string) => {
    const newSteps = [...content.steps];
    newSteps[index] = value;
    setContent({
      ...content,
      steps: newSteps,
    });
  };

  const handleRemoveStep = (index: number) => {
    const newSteps = [...content.steps];
    newSteps.splice(index, 1);
    setContent({
      ...content,
      steps: newSteps,
    });
  };

  const handleAddChecklistItem = () => {
    setChecklist([
      ...checklist,
      {
        id: `item-${checklist.length}`,
        text: '',
        completed: false,
      },
    ]);
  };

  const handleChecklistItemChange = (id: string, value: string) => {
    setChecklist(
      checklist.map(item =>
        item.id === id ? { ...item, text: value } : item
      )
    );
  };

  const handleChecklistItemToggle = (id: string) => {
    setChecklist(
      checklist.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleRemoveChecklistItem = (id: string) => {
    setChecklist(checklist.filter(item => item.id !== id));
  };

  const handleDownloadPDF = async () => {
    // In a real implementation, this would generate and download a PDF
    alert('PDF download would be implemented here');
  };

  const handleExportToNotion = async () => {
    // In a real implementation, this would export to Notion
    alert('Export to Notion would be implemented here');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!sop) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">SOP not found</h1>
          <button
            onClick={() => router.push('/dashboard')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

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
              <span className="text-indigo-600 font-medium">View SOP</span>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* SOP Header */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex justify-between items-start">
              {editing ? (
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-3xl font-bold text-gray-900 border-b border-gray-300 focus:outline-none focus:border-indigo-500 w-full"
                />
              ) : (
                <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
              )}
              <div className="flex space-x-3">
                {editing ? (
                  <>
                    <button
                      onClick={() => setEditing(false)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setEditing(true)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={handleDownloadPDF}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      PDF
                    </button>
                    <button
                      onClick={handleExportToNotion}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                      Notion
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="mt-4 text-sm text-gray-500">
              Created on {new Date(sop.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>

          {/* SOP Content */}
          <div className="space-y-8">
            {/* Purpose Section */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Purpose</h2>
              </div>
              <div className="px-6 py-5">
                {editing ? (
                  <textarea
                    value={content.purpose}
                    onChange={(e) => setContent({ ...content, purpose: e.target.value })}
                    className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Describe the purpose of this procedure..."
                  />
                ) : (
                  <p className="text-gray-700 whitespace-pre-line">{content.purpose}</p>
                )}
              </div>
            </div>

            {/* Tools Section */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Tools / Apps</h2>
              </div>
              <div className="px-6 py-5">
                {editing ? (
                  <input
                    type="text"
                    value={content.tools}
                    onChange={(e) => setContent({ ...content, tools: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="List the tools and applications used..."
                  />
                ) : (
                  <p className="text-gray-700">{content.tools}</p>
                )}
              </div>
            </div>

            {/* Steps Section */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Step-by-Step Instructions</h2>
                {editing && (
                  <button
                    onClick={handleAddStep}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Step
                  </button>
                )}
              </div>
              <div className="px-6 py-5">
                <ol className="space-y-4">
                  {content.steps.map((step, index) => (
                    <li key={index} className="flex">
                      <span className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100 text-indigo-800 font-bold mr-4">
                        {index + 1}
                      </span>
                      {editing ? (
                        <div className="flex-grow flex items-center">
                          <input
                            type="text"
                            value={step}
                            onChange={(e) => handleStepChange(index, e.target.value)}
                            className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder={`Step ${index + 1}...`}
                          />
                          {content.steps.length > 1 && (
                            <button
                              onClick={() => handleRemoveStep(index)}
                              className="ml-2 text-red-500 hover:text-red-700 p-2"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                          )}
                        </div>
                      ) : (
                        <p className="text-gray-700">{step}</p>
                      )}
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Notes Section */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Notes & Best Practices</h2>
              </div>
              <div className="px-6 py-5">
                {editing ? (
                  <textarea
                    value={content.notes}
                    onChange={(e) => setContent({ ...content, notes: e.target.value })}
                    className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Add any important notes or best practices..."
                  />
                ) : (
                  <p className="text-gray-700 whitespace-pre-line">{content.notes}</p>
                )}
              </div>
            </div>

            {/* Checklist Section */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Checklist</h2>
                {editing && (
                  <button
                    onClick={handleAddChecklistItem}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add Item
                  </button>
                )}
              </div>
              <div className="px-6 py-5">
                {checklist.length > 0 ? (
                  <ul className="space-y-3">
                    {checklist.map((item) => (
                      <li key={item.id} className="flex items-start">
                        {editing ? (
                          <>
                            <input
                              type="text"
                              value={item.text}
                              onChange={(e) => handleChecklistItemChange(item.id, e.target.value)}
                              className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder="Checklist item..."
                            />
                            <button
                              onClick={() => handleRemoveChecklistItem(item.id)}
                              className="ml-2 text-red-500 hover:text-red-700 p-2"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </>
                        ) : (
                          <>
                            <input
                              type="checkbox"
                              checked={item.completed}
                              onChange={() => handleChecklistItemToggle(item.id)}
                              className="mt-1 h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                            <span className={`ml-3 text-gray-700 ${item.completed ? 'line-through text-gray-400' : ''}`}>
                              {item.text}
                            </span>
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    {editing ? (
                      <p>No checklist items. Add items using the "Add Item" button.</p>
                    ) : (
                      <p>No checklist items for this SOP.</p>
                    )}
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