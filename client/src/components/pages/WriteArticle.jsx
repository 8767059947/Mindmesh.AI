import { Edit, Sparkles, Clipboard } from 'lucide-react';
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

function WriteArticle() {
  // 👇 Available article length options
  const articleLength = [
    { length: 800, text: 'Short (500-800 words)' },
    { length: 1200, text: 'Medium (800-1200 words)' },
    { length: 1600, text: 'Long (1200+ words)' }
  ];

  // 👇 States for inputs and output
  const [selectedLength, setSelectedLength] = useState(articleLength[0]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const { getToken } = useAuth();

  // ✅ Form submit hone par API ko call karega
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // 🤖 Prompt banate hain based on user input
      const prompt = `Write an article about ${input} in ${selectedLength.text}`;

      // 🔐 Auth token ke saath request bhejna zaroori hai
      const { data } = await axios.post(
        '/api/ai/generate-article',
        {
          prompt,
          length: selectedLength.length
        },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`
          }
        }
      );

      // 🎯 Agar success mila toh content dikhayenge
      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard!");
  } catch (err) {
    toast.error("Failed to copy!");
  }
};


  return (
    <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>
      {/* 🎛️ Left Column: Article Configuration Form */}
      <form onSubmit={onSubmitHandler} className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200'>
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#4A7AFF]' />
          <h1 className='text-xl font-semibold'>Article Configuration</h1>
        </div>

        {/* ✏️ Topic Input Field */}
        <p className='mt-6 text-sm font-medium'>Article Topic</p>
        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type='text'
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300'
          placeholder='The future of artificial intelligence is...'
          required
        />

        {/* 📏 Length Selector */}
        <p className='mt-4 text-sm font-medium'>Article Length</p>
        <div className='mt-3 flex gap-3 flex-wrap sm:max-w-9/11'>
          {articleLength.map((item, index) => (
            <span
              onClick={() => setSelectedLength(item)}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${
                selectedLength.text === item.text
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-500 border-gray-300'
              }`}
              key={index}
            >
              {item.text}
            </span>
          ))}
        </div>

        {/* 🚀 Submit Button */}
       <button
  type='submit'
  disabled={loading}
  className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#226BFF] to-[#65ADFF] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer disabled:opacity-60'
>
  {loading 
    ? <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
    : <Edit className="w-5" />
  }
  <span>{loading ? "Generating..." : "Generate Article"}</span>
</button>

      </form>

      {/* 📄 Right Column: Article Preview */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]'>
        {/* 🔵 Header Section */}
        <div className='flex items-center gap-3'>
          <Edit className='w-5 h-5 text-[#4A7AFF]' />
          <h1 className='text-xl font-semibold'>Generated article</h1>
        </div>

        {content && (
  <div className="flex justify-end mt-2">
    <button
      onClick={copyToClipboard}
      className="flex items-center gap-2 text-xs px-3 py-1 rounded-md border border-blue-500 text-blue-600 hover:bg-blue-50 transition"
    >
      <Clipboard className="w-4 h-4" />
      Copy
    </button>
  </div>
)}


        {/* 📄 Output or Empty Message */}
        {!content ? (
          <>
            {/* 😴 Empty Message jab tak kuch generate nahi hua */}
            <div className='flex-1 flex justify-center items-center'>
              <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
                <Edit className='w-9 h-9' />
                <p>Enter a topic and click “Generate article” to get started.</p>
              </div>
            </div>
          </>
        ) : (
          // 📄 Show generated content
          
          <div className="mt-3 h-full overflow-y-scroll text-sm text-slate-600">
            <div className='reset-tw'>
              <Markdown>
                {content}
              </Markdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WriteArticle;
