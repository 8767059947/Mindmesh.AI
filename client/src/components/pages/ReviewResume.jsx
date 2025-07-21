import { FileText, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';// ✅ Ensure import from your lib

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

function ReviewResume() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const { getToken } = useAuth();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== 'application/pdf') {
      toast.error('Please upload a valid PDF file');
      return;
    }
    setInput(file);
    setContent(''); // Reset preview
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('resume', input);

      const { data } = await axios.post('/api/ai/resume-review', formData, {
        headers: {
          Authorization: `Bearer ${await getToken()}`,
        },
      });

      data.success ? setContent(data.content) : toast.error(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
      {/* Left Panel */}
      <form onSubmit={onSubmitHandler} className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#00DA83]" />
          <h1 className="text-xl font-semibold text-slate-700">Resume Review</h1>
        </div>

        <p className="mt-6 text-sm font-medium text-slate-700">Upload Resume</p>
        <input
          type="file"
          accept="application/pdf"
          required
          onChange={handleFileChange}
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600 file:mr-3 file:px-4 file:py-2 file:border-0 file:rounded-md file:bg-[#00DA83] file:text-white file:cursor-pointer"
        />
        <p className="text-xs text-gray-500 font-light mt-1">Supports PDF Resume only</p>

        <button
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#00DA83] to-[#009BB3] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer disabled:opacity-60"
        >
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin" />
          ) : (
            <FileText className="w-5" />
          )}
          Review Resume
        </button>
      </form>

     {/* 📄 Right Column: Article Preview */}
<div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]'>
  {/* 🔵 Header Section */}
  <div className='flex items-center gap-3'>
    <FileText className='w-5 h-5 text-[#00DA83]' />
    <h1 className='text-xl font-semibold'>Analysis Results</h1>
  </div>

  {!content ? (
    <div className='flex-1 flex justify-center items-center'>
      <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
        <FileText className='w-9 h-9' />
        <p>Upload a resume and click "Review Resume" to get started</p>
      </div>
    </div>
  ) : (
    <div className="mt-3 overflow-y-auto text-sm text-slate-600 flex-1">
      <div className='reset-tw'>
        <Markdown>{content}</Markdown>
      </div>
    </div>
  )}
</div>

    </div>
  );
}

export default ReviewResume;
