import React, { useState, FormEvent } from 'react'
import Link from 'next/link'

interface Test {
    title: string;
    prompt: string;
    tag: string;
}

interface Props {
    type: string;
    test: Test;
    setTest: React.Dispatch<React.SetStateAction<Test>>;
    submitting: boolean;
    handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

const Form: React.FC<Props> = ({
    type,
    test,
    setTest,
    submitting,
    handleSubmit
}) => {
    return (
        <section className='w-full max-w-full flex-start flex-col'>
            <h1 className='head_text text-left'>
                <span className='green_gradient'>{type} Test</span>
            </h1>

            <p className='desc text-left max-w-md'>
                {type} and share amazing tests with the world!
            </p>

            <form className='mt-10 w-full max-w-2xl flex flex-col gap-7 glassmorphism' onSubmit={handleSubmit}>
                <label>
                    <span className='font-satoshi font-semibold text-base text-gray-200'>
                        Test Title
                    </span>

                    <input
                        value={test.title}
                        onChange={(e) => setTest({ ...test, title: e.target.value })}
                        placeholder='Write your test title here...'
                        required
                        className='form_input'
                    />
                    <textarea
                        value={test.prompt}
                        onChange={(e) => setTest({ ...test, prompt: e.target.value })}
                        placeholder='Write your ChatGPT prompt for test here.'
                        required
                        className='form_textarea'
                    />
                </label>
                <label>
                    <span className='font-satoshi font-semibold text-base text-gray-200'>
                        Tag
                    </span>

                    <input
                        value={test.tag}
                        onChange={(e) => setTest({ ...test, tag: e.target.value })}
                        placeholder='Write your tags here e.g., react, git, python etc.'
                        required
                        className='form_input'
                    />
                </label>

                <div className='flex-end mx-3 gap-4'>
                    <Link href="/" className='text-gray-500 text-sm outline_btn'>
                        Cancel
                    </Link>
                    <button
                        type='submit'
                        disabled={submitting}
                        className='px-5 py-1.5 text-sm bg-primary-orange rounded-full text-white green_btn'
                    >
                        {submitting ? `${type}...` : type}

                    </button>
                </div>

            </form>

        </section>
    )
}

export default Form