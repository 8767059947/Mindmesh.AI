import { Sparkles, Image, Copy } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

function GenerateImages() {
  const imageStyle = [
    'Realistic',
    'Ghibli style',
    'Anime style',
    'Cartoon style',
    'Fantasy style',
    'Realistic style',
    '3D style',
    'Portrait style',
  ];

  const [selectedStyle, setSelectedStyle] = useState('Realistic');
  const [input, setInput] = useState('');
  const [publish, setPublish] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const [authToken, setAuthToken] = useState(''); // 🛡️ Store token once
  const { getToken } = useAuth();

  // 🧠 Fetch token only once per session to avoid Clerk session sync flood
  useEffect(() => {
    (async () => {
      const token = await getToken();
      setAuthToken(token);
    })();
  }, []);

  // 🔧 Handle form submission
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!authToken) {
      toast.error("Auth token not ready. Try again in a few seconds...");
      return;
    }

    setLoading(true);

    try {
      const prompt = `Generate an image of ${input} in the style ${selectedStyle}`;

      const { data } = await axios.post(
        '/api/ai/generate-image',
        { prompt, publish },
        {
          headers: {
            Authorization: `Bearer ${authToken}`, // ✅ Use cached token
          },
        }
      );

      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }

    setLoading(false);
  };

  // 📋 Copy to clipboard
  const copyToClipboard = () => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    toast.success("Image URL copied to clipboard!");
  };

  return (
    <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>
      {/* 🔧 Image form */}
      <form
        onSubmit={onSubmitHandler}
        className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200'
      >
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#00AD25]' />
          <h1 className='text-xl font-semibold'>AI Image Generator</h1>
        </div>

        <p className='mt-6 text-sm font-medium'>Describe Your Image</p>
        <textarea
          onChange={(e) => setInput(e.target.value)}
          value={input}
          rows={4}
          required
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300'
          placeholder='Describe what you want to see in the image...'
        />

        <p className='mt-4 text-sm font-medium'>Style</p>
        <div className='mt-3 flex gap-3 flex-wrap sm:max-w-9/11'>
          {imageStyle.map((item) => (
            <span
              onClick={() => setSelectedStyle(item)}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${
                selectedStyle === item
                  ? 'bg-green-50 text-green-700'
                  : 'text-gray-500 border-gray-300'
              }`}
              key={item}
            >
              {item}
            </span>
          ))}
        </div>

        <div className='my-6 flex items-center gap-2'>
          <label className='relative cursor-pointer'>
            <input
              type='checkbox'
              onChange={(e) => setPublish(e.target.checked)}
              checked={publish}
              className='sr-only peer'
            />
            <div className='w-9 h-5 bg-slate-300 rounded-full peer-checked:bg-green-500 transition'></div>
            <span className='absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition peer-checked:translate-x-4'></span>
          </label>
          <p className='text-sm text-slate-700'>Make this image Public</p>
        </div>

        <button
          disabled={loading}
          className={`w-full flex justify-center items-center gap-2 
            ${
              loading
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#00AD25] to-[#04FF50] cursor-pointer'
            }
            text-white px-4 py-2 mt-6 text-sm rounded-lg transition duration-200`}
        >
          {loading ? (
            <>
              <span className='w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin'></span>
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Image className='w-5' />
              <span>Generate Image</span>
            </>
          )}
        </button>
      </form>

      {/* 🖼️ Output */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96'>
        <div className='flex items-center gap-3'>
          <Image className='w-5 h-5 text-[#00AD25]' />
          <h1 className='text-xl font-semibold'>Generated image</h1>
        </div>

        {!content ? (
          <div className='flex-1 flex justify-center items-center'>
            <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
              <Image className='w-9 h-9' />
              <p>Enter a topic and click “Generate image” to get started</p>
            </div>
          </div>
        ) : (
          <div className='mt-3 relative'>
            <img src={content} alt='Generated' className='w-full h-full rounded-lg' />

            <button
              onClick={copyToClipboard}
              className='absolute top-3 right-3 bg-white text-slate-700 hover:bg-slate-100 border border-gray-200 p-1 rounded-full shadow-md'
              title='Copy image URL'
            >
              <Copy className='w-4 h-4' />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default GenerateImages;
