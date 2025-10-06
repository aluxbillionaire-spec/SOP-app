'use client';

import { useState } from 'react';

interface SOPViewerProps {
  title: string;
  purpose: string;
  tools: string;
  steps: string[];
  notes: string;
  checklist: string[];
  editable?: boolean;
  onEdit?: (field: string, value: any) => void;
}

export default function SOPViewer({
  title,
  purpose,
  tools,
  steps,
  notes,
  checklist,
  editable = false,
  onEdit
}: SOPViewerProps) {
  const [checklistItems, setChecklistItems] = useState(
    checklist.map((item, index) => ({ id: index, text: item, completed: false }))
  );

  const handleChecklistToggle = (id: number) => {
    setChecklistItems(
      checklistItems.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Purpose</h2>
        <p className="text-gray-700">{purpose}</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Tools / Apps</h2>
        <p className="text-gray-700">{tools}</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Step-by-Step Instructions</h2>
        <ol className="space-y-2">
          {steps.map((step, index) => (
            <li key={index} className="flex">
              <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 text-indigo-800 font-bold mr-3">
                {index + 1}
              </span>
              <p className="text-gray-700">{step}</p>
            </li>
          ))}
        </ol>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Notes & Best Practices</h2>
        <p className="text-gray-700">{notes}</p>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Checklist</h2>
        <ul className="space-y-2">
          {checklistItems.map((item) => (
            <li key={item.id} className="flex items-center">
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => handleChecklistToggle(item.id)}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span className={`ml-3 text-gray-700 ${item.completed ? 'line-through' : ''}`}>
                {item.text}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}