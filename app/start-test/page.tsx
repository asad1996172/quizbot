'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import OpenAI from 'openai';
import ReactMarkdown from 'react-markdown';
import { useChatGPTAPI } from '@context/ChatGPTAPIContext';

const StartTest = () => {
  const searchParams = useSearchParams();
  const testId = searchParams.get('id')
  const { chatgptapi, setChatGPTAPI } = useChatGPTAPI();

  const [isApiValid, setIsApiValid] = useState(false);
  const [openai, setOpenai] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [resultPercentage, setResultPercentage] = useState(0);
  const [questionTemplate, setQuestionTemplate] = useState('');
  const [conversation, setConversation] = useState<{ [key: string]: any }[]>([]);
  const [loading, setLoading] = useState(false);
  const [inputTest, setInputText] = useState('');
  const containerRef = useRef(null);
  const [test, setTest] = useState({
    'title': '',
    'prompt': '',
    'tag': '',
  });

  useEffect(() => {
    console.log("Conversation changed!", conversation);
    const container = containerRef.current;
    container.scrollTop = container.scrollHeight;
  }, [conversation]);

  const nextQuestion = async () => {
    setLoading(true);
    try {
      const initialConversation = [{
        role: 'user',
        content: questionTemplate
      }];
      const chatCompletion = await openai.chat.completions.create({
        messages: initialConversation,
        model: 'gpt-4'
      });

      const response = chatCompletion.choices[0].message;
      initialConversation.push(response);
      setConversation(initialConversation);
      setTotalQuestions(prevQuestions => prevQuestions + 1);
      setInputText('');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  
  const startTest = async () => {
    setLoading(true);
    try {
      const initialConversation = [{
        role: 'user',
        content: questionTemplate
      }];
      const chatCompletion = await openai.chat.completions.create({
        messages: initialConversation,
        model: 'gpt-4'
      });

      const response = chatCompletion.choices[0].message;
      setTotalQuestions(prevQuestions => prevQuestions + 1);
      initialConversation.push(response);
      setConversation(initialConversation);
      setInputText('');
      setTotalCorrect(0);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const extractScore = (content) => {
    const regex = /Score:\s*([\d.]+)/;
    const match = content.match(regex);
    return match ? parseFloat(match[1]) : null;
  }

  const sendResponse = async () => {
    setLoading(true);
    try {
      const userResponse = [{
        role: 'user',
        content: inputTest
      }];
      console.log("User response: ", userResponse);

      const chatCompletion = await openai.chat.completions.create({
        messages: [...conversation, ...userResponse],
        model: 'gpt-4'
      });

      const response = chatCompletion.choices[0].message;
      setConversation([...conversation, ...userResponse, response]);
      if (extractScore(response.content) !== null) {
        setTotalCorrect(prevCorrect => prevCorrect + extractScore(response.content));
      }

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (totalQuestions > 0) {
      const percentage = (totalCorrect / totalQuestions) * 100;
      setResultPercentage(percentage);
    }
    console.log("Total questions: ", totalQuestions);
    console.log("Total correct: ", totalCorrect);
  }, [totalQuestions, totalCorrect]);

  useEffect(() => {
    const getTestDetails = async () => {
      const response = await fetch(`/api/test/${testId}`);
      const data = await response.json();

      setTest({
        title: data.title,
        prompt: data.prompt,
        tag: data.tag,
      })
      setQuestionTemplate(`
${data.prompt}
------------
Generate a question (make sure you only generate one) for above given 
description for a test. 

When I answer, Give me a score of how correct the answer is. 
If the question is objective i.e., multiple choice, give me the
score which is either 0 or 1, 0 being incorrect and 1 being correct.
And if the question is subjective, give me a score between 0 and 1.

The response to my answer should start in the following format:
Score: <score>

After the score, I might ask followup questions regarding the score
or what's the correct answer. Please answer them as well.

Your response to this initially should just contain the question.
      `);
    }

    const connectToChatGPTAPI = async () => {
      setLoading(true);
      try {
        const openaiObj = new OpenAI({
          apiKey: chatgptapi,
          dangerouslyAllowBrowser: true
        });

        const chatCompletion = await openaiObj.chat.completions.create({
          messages: [{ role: 'user', content: 'Say this is a test' }],
          model: 'gpt-4',
        });
        setIsApiValid(true);
        setOpenai(openaiObj);
      } catch (error) {
        console.error(error);
        setIsApiValid(false);
        setOpenai(null);
      } finally {
        setLoading(false);
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


        <div ref={containerRef} className='flex-grow overflow-y-auto'>

          {!isApiValid ? (
            <div className='w-full bg-red-950 rounded-3xl px-5 py-3 mb-4 whitespace-pre-line'>
              Please enter the correct ChatGPT API key to start test !!
            </div>
          ) : conversation.length === 0 ? (
            <div className='w-full bg-yellow-950 rounded-3xl px-5 py-3 mb-4 whitespace-pre-line'>
              You may start test now !!
            </div>
          ) : null}

          {conversation.map((message, index) => {
            if (index === 0) return null; // Skipping the first element
            if (message.role === "assistant") {
              return (
                <div key={index} className='w-full bg-green-950 rounded-3xl px-5 py-3 mb-4 whitespace-pre-line'>
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              );
            } else if (message.role === "user") {
              return (
                <div key={index} className='w-full bg-gray-950 rounded-3xl px-5 py-3 mb-4 whitespace-pre-line'>
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              );
            }
            return null; // in case there's another role or an object without role, though not expected in the given example
          })}



        </div>

        {loading ? (
          <div className="flex items-center justify-center">
            <Image src="/assets/icons/loader.svg" alt="loading" width={50} height={50} className="object-container" />
          </div>
        ) : (<div className="flex mt-4 items-center w-full bg-black rounded-full">
          <textarea
            placeholder="Enter text here..."
            className='flex-grow p-5 bg-black rounded-full outline-none'
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={async (e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                console.log("Enter key pressed!");
                await sendResponse();
                setInputText('');
              }
            }}
            disabled={!isApiValid || conversation.length === 0}
            value={inputTest}
          />
          <button
            onClick={async () => {
              console.log("Icon clicked!");
              await sendResponse();
              setInputText('');
            }}
            className="pr-6">
            <Image
              src='/assets/icons/enter.svg'
              alt='copy_icon'
              width={20}
              height={20}
            />

          </button>
        </div>)}

      </section>



      <section className='flex flex-col md:flex-row items-center justify-between w-full bg-gray-900 rounded-3xl p-5 mt-4'>

        {/* Left Buttons */}
        <div className='flex mb-4 md:mb-0 mr-4 space-x-2'>
          <button className={isApiValid ? 'green_btn' : 'light_btn'} disabled={!isApiValid} onClick={startTest}>
            Start Test
          </button>
          <button className={isApiValid ? 'yellow_btn' : 'light_btn'} disabled={!isApiValid} onClick={nextQuestion}>
            Next Question
          </button>
        </div>

        {/* Right Glowing Progress Bar */}
        <div className='flex items-center w-full md:w-auto'>
            <span className="mr-4 rounded-full border border-white bg-transparent py-1.5 px-5 text-white">Result: {resultPercentage.toFixed(0)}%</span>

          <div className='relative w-64 md:w-80'>
            <div className="w-full h-9 bg-gray-200 rounded-full dark:bg-gray-700">
              <div className="h-9 bg-gradient-to-r from-pink-500 to-blue-500 rounded-full dark:bg-blue-500 shadow-md" style={{ width: `${resultPercentage}%` }}></div>
            </div>
          </div>
        </div>

      </section >





    </>


  )
}

export default StartTest