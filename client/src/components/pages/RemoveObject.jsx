import { Scissors, Sparkles } from 'lucide-react';
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

function RemoveObject() {
  const [input, setInput] = useState('');
  const [object, setObject] = useState('');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      // ❗ Only one object name allowed
      if (object.split(' ').length > 1) {
        setLoading(false);
        return toast('Please enter only one object name');
      }

      const formData = new FormData();
      formData.append('image', input);
      formData.append('object', object);

      const { data } = await axios.post(
        '/api/ai/remove-image-object',
        formData,
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`,
          },
        }
      );

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

  return (
    <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>
      {/* 🔧 Left Column */}
      <form
        onSubmit={onSubmitHandler}
        className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200'
      >
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#4A7AFF]' />
          <h1 className='text-xl font-semibold text-slate-700'>Object Removal</h1>
        </div>

        <p className='mt-6 text-sm font-medium text-slate-700'>Upload Image</p>
        <input
          type='file'
          accept='image/*'
          required
          onChange={(e) => setInput(e.target.files[0])}
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600 file:mr-3 file:px-4 file:py-2 file:border-0 file:rounded-md file:bg-[#4A7AFF] file:text-white file:cursor-pointer'
        />

        <p className='mt-6 text-sm font-medium'>Describe object name to remove</p>
        <textarea
          onChange={(e) => setObject(e.target.value)}
          value={object}
          rows={4}
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300'
          placeholder='e.g., watch or spoon , Only single object name'
          required
        />

        <button
          disabled={loading || !input || !object}
          className='w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#417DF6] to-[#8E37EB] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
        >
          {loading ? (
            <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span>
          ) : (
            <Scissors className='w-5' />
          )}
          Remove object
        </button>
      </form>

      {/* 📄 Right Column */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96'>
        <div className='flex items-center gap-5'>
          <Scissors className='w-5 h-5 text-[#4A7AFF]' />
          <h1 className='text-xl font-semibold'>Processed Image</h1>
        </div>

        {!content ? (
          <div className='flex-1 flex justify-center items-center'>
            <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
              <Scissors className='w-9 h-9' />
              <p>Upload an image and click "Remove Object" to get started</p>
            </div>
          </div>
        ) : (
          <>
            <img
              src={content}
              alt="processed"
              onError={(e) => (e.target.style.display = 'none')}
              className='mt-3 w-full h-full rounded-md shadow'
            />

            <div className='flex gap-2 justify-end mt-4'>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(content);
                  toast.success('Image URL copied!');
                }}
                className='text-sm text-[#4A7AFF] border border-[#4A7AFF] px-3 py-1 rounded hover:bg-[#4A7AFF] hover:text-white transition'
              >
                Copy URL
              </button>

              <a
                href={content}
                download='object-removed.png'
                className='text-sm text-green-600 border border-green-600 px-3 py-1 rounded hover:bg-green-600 hover:text-white transition'
              >
                Download
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default RemoveObject;
