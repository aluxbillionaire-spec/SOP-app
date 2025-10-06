'use client';

import { useState, useEffect } from 'react';
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
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
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          {editing ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-2xl font-bold text-gray-900 border-b border-gray-300 focus:outline-none focus:border-indigo-500"
            />
          ) : (
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          )}
          <div className="flex space-x-2">
            {editing ? (
              <>
                <button
                  onClick={() => setEditing(false)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Save
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setEditing(true)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Edit
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Download PDF
                </button>
                <button
                  onClick={handleExportToNotion}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Export to Notion
                </button>
              </>
            )}
          </div>
        </div>
      </header>
      <main>
        <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h2 className="text-lg leading-6 font-medium text-gray-900">Purpose</h2>
              </div>
              <div className="px-4 py-5 sm:px-6">
                {editing ? (
                  <textarea
                    value={content.purpose}
                    onChange={(e) => setContent({ ...content, purpose: e.target.value })}
                    className="w-full h-24 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                ) : (
                  <p className="text-gray-700">{content.purpose}</p>
                )}
              </div>
            </div>

            <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h2 className="text-lg leading-6 font-medium text-gray-900">Tools / Apps</h2>
              </div>
              <div className="px-4 py-5 sm:px-6">
                {editing ? (
                  <input
                    type="text"
                    value={content.tools}
                    onChange={(e) => setContent({ ...content, tools: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                ) : (
                  <p className="text-gray-700">{content.tools}</p>
                )}
              </div>
            </div>

            <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg leading-6 font-medium text-gray-900">Step-by-Step Instructions</h2>
                {editing && (
                  <button
                    onClick={handleAddStep}
                    className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Add Step
                  </button>
                )}
              </div>
              <div className="px-4 py-5 sm:px-6">
                <ol className="space-y-4">
                  {content.steps.map((step, index) => (
                    <li key={index} className="flex">
                      <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 text-indigo-800 font-bold mr-3">
                        {index + 1}
                      </span>
                      {editing ? (
                        <div className="flex-grow flex items-center">
                          <input
                            type="text"
                            value={step}
                            onChange={(e) => handleStepChange(index, e.target.value)}
                            className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                          <button
                            onClick={() => handleRemoveStep(index)}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <p className="text-gray-700">{step}</p>
                      )}
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                <h2 className="text-lg leading-6 font-medium text-gray-900">Notes & Best Practices</h2>
              </div>
              <div className="px-4 py-5 sm:px-6">
                {editing ? (
                  <textarea
                    value={content.notes}
                    onChange={(e) => setContent({ ...content, notes: e.target.value })}
                    className="w-full h-24 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                ) : (
                  <p className="text-gray-700">{content.notes}</p>
                )}
              </div>
            </div>

            <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg leading-6 font-medium text-gray-900">Checklist</h2>
                {editing && (
                  <button
                    onClick={handleAddChecklistItem}
                    className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Add Item
                  </button>
                )}
              </div>
              <div className="px-4 py-5 sm:px-6">
                <ul className="space-y-2">
                  {checklist.map((item) => (
                    <li key={item.id} className="flex items-center">
                      {editing ? (
                        <>
                          <input
                            type="text"
                            value={item.text}
                            onChange={(e) => handleChecklistItemChange(item.id, e.target.value)}
                            className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                          />
                          <button
                            onClick={() => handleRemoveChecklistItem(item.id)}
                            className="ml-2 text-red-500 hover:text-red-700"
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
                            className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                          />
                          <span className={`ml-3 text-gray-700 ${item.completed ? 'line-through' : ''}`}>
                            {item.text}
                          </span>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}