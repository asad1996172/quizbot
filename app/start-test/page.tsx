'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import OpenAI from 'openai';
import { useChatGPTAPI } from '@context/ChatGPTAPIContext';
import { set } from 'mongoose';

const StartTest = () => {
  const searchParams = useSearchParams();
  const testId = searchParams.get('id')
  const { chatgptapi, setChatGPTAPI } = useChatGPTAPI();
  const [isApiValid, setIsApiValid] = useState(false);
  const [openai, setOpenai] = useState(null);

  const [inputTest, setInputText] = useState('');

  const router = useRouter();
  const [test, setTest] = useState({
    'title': '',
    'prompt': '',
    'tag': '',
  });

  useEffect(() => {
    const getTestDetails = async () => {
      const response = await fetch(`/api/test/${testId}`);
      const data = await response.json();

      setTest({
        title: data.title,
        prompt: data.prompt,
        tag: data.tag,
      })
    }

    const connectToChatGPTAPI = async () => {
      try {
        const openaiObj = new OpenAI({
          apiKey: chatgptapi,
          dangerouslyAllowBrowser: true
        });
        
        const chatCompletion = await openaiObj.chat.completions.create({
          messages: [{ role: 'user', content: 'Say this is a test' }],
          model: 'gpt-3.5-turbo',
        });

        setIsApiValid(true);
        setOpenai(openaiObj);
      } catch (error) {
        console.error(error);
        setIsApiValid(false);
        setOpenai(null);
      }
    }

    if (testId) getTestDetails();
    if (chatgptapi) connectToChatGPTAPI();
  }, [testId, chatgptapi])
  return (
    <>
      <section
        style={{ height: 'calc(100vh - 20rem)' }}
        className='flex flex-col w-full p-5 bg-gray-900 rounded-3xl'>

        <div className='flex-grow overflow-y-auto'>
          <div className='w-full bg-green-950 rounded-3xl px-5 py-3 mb-4'>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Doloremque voluptatem quaerat eum adipisci, sequi magni sint, amet at laudantium, repudiandae corporis ducimus? Temporibus est sit iure. Ullam illum quae non.
          </div>
          <div className='w-full bg-gray-950 rounded-3xl px-5 py-3 mb-4'>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Doloremque voluptatem quaerat eum adipisci, sequi magni sint, amet at laudantium, repudiandae corporis ducimus? Temporibus est sit iure. Ullam illum quae non.
          </div>
        </div>

        <div className="flex mt-4 items-center w-full bg-black rounded-full">
          <input
            type="text"
            placeholder=" Enter text here..."
            className='flex-grow p-5 bg-black rounded-full outline-none'
            onChange={(e) => setInputText(e.target.value)}
            value={inputTest}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                console.log("Enter key pressed!");
                console.log(inputTest);
              }
            }}
          />
          <button
            onClick={() => {
              console.log("Icon clicked!");
              console.log(inputTest);
            }}
            className="pr-6">
            <Image
              src='/assets/icons/enter.svg'
              alt='copy_icon'
              width={20}
              height={20}
            />

          </button>
        </div>
      </section>

      <section className='flex flex-col md:flex-row items-center justify-between w-full bg-gray-900 rounded-3xl p-5 mt-4'>

        {/* Left Buttons */}
        <div className='flex mb-4 md:mb-0 mr-4 space-x-2'>
          <button className='green_btn'>
            Start Test
          </button>
          <button className='yellow_btn'>
            Next Question
          </button>
        </div>

        {/* Right Glowing Progress Bar */}
        <div className='flex items-center w-full md:w-auto'>
          <span className="mr-4 rounded-full border border-white bg-transparent py-1.5 px-5 text-white">Result: 45%</span>

          <div className='relative w-64 md:w-80'>
            <div className="w-full h-9 bg-gray-200 rounded-full dark:bg-gray-700">
              <div className="h-9 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full dark:bg-blue-500 shadow-md" style={{ width: '45%' }}></div>
            </div>
          </div>
        </div>

      </section >





    </>


  )
}

export default StartTest