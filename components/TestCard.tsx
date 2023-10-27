"use client";

import { useState } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

const TestCard = ({ test, handleTagClick, handleEdit, handleDelete }) => {
    const [copied, setCopied] = useState("");
    const { data: session } = useSession();
    const pathName = usePathname();
    console.log(test);
    console.log(session)

    const handleCopy = () => {
        setCopied(test.prompt);
        navigator.clipboard.writeText(test.prompt);

        setTimeout(() => setCopied(""), 3000);
    }

    return (
        <div className='prompt_card'>
            <div
                className='flex justify-between items-start gap-5'
            >
                <div className='flex-1 flex justify-start items-center gap-3 cursor-pointer'>
                    <Image
                        src={test.creator.image}
                        alt="user_image"
                        width={40}
                        height={40}
                        className='rounded-full object-contain'
                    />

                    <div className='flex flex-col'>
                        <h3 className='font-semibold text-white-900'>{test.creator.username}</h3>
                        <p className='text-sm text-gray-500'>{test.creator.email}</p>

                    </div>

                </div>

                <div className='copy_btn' onClick={handleCopy}>
                    <Image
                        src={copied === test.prompt ? '/assets/icons/tick.svg' : '/assets/icons/copy.svg'}
                        alt='copy_icon'
                        width={18}
                        height={18}
                    />

                </div>

            </div>

            <h2 className='my-4  text-lg green_gradient font-semibold'>
                {test.title}
            </h2>
            <p className='my-4  text-sm text-gray-400 whitespace-pre-line'>
                {test.prompt}
            </p>

            {
                test.tag.split(',').map((singleTag, index) => (
                    <span key={index} className='text-sm yellow_gradient cursor-pointer' onClick={() => handleTagClick && handleTagClick(singleTag.trim())}>
                        #{singleTag.trim()}{' '}
                    </span>
                ))
            }

            <div className='mt-5 flex-center gap-4 '>
            {((session?.user) as any)?.id === test.creator._id &&
                pathName === '/profile' && (
                    <>
                        <p className='text-md cursor-pointer outline_btn' onClick={handleEdit}>
                            Edit
                        </p>
                        <p className='text-md cursor-pointer outline_btn' onClick={handleDelete}>
                            Delete
                        </p>
                    </>
                )}
                <Link href={`/start-test?id=${test._id}`} className="green_btn">
                    Start Test
                </Link>
            </div>

        </div>
    )
}

export default TestCard