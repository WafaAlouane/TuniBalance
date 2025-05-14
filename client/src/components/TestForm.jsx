import React, { useState } from 'react';

const TestForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  
  const [isVisible, setIsVisible] = useState(true);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Form submitted with: ${JSON.stringify(formData)}`);
  };
  
  return (
    <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-purple-600 dark:text-purple-400">Test Form Component</h2>
        <button 
          onClick={() => setIsVisible(!isVisible)}
          className="px-3 py-1 bg-purple-500 hover:bg-purple-600 text-white rounded"
        >
          {isVisible ? 'Hide Form' : 'Show Form'}
        </button>
      </div>
      
      {isVisible && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white"
              placeholder="Enter your name"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-slate-700 dark:text-white"
              placeholder="Enter your email"
            />
          </div>
          
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded shadow"
            >
              Submit
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default TestForm;
