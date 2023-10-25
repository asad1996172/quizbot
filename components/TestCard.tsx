"use client";

import { useState } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';

const TestCard = ({ test, handleTagClick, handleEdit, handleDelete }) => {
    const [copied, setCopied] = useState("");
    const { data: session } = useSession();
    const pathName = usePathname();
    const router = useRouter();

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
                        width={12}
                        height={12}
                    />

                </div>

            </div>

            <h2 className='my-4  text-lg green_gradient font-semibold'>
                {test.title}
            </h2>
            <p className='my-4  text-sm text-gray-400'>
                {test.prompt}
            </p>

            {
                test.tag.split(',').map((singleTag, index) => (
                    <span key={index} className='text-sm yellow_gradient cursor-pointer' onClick={() => handleTagClick && handleTagClick(singleTag.trim())}>
                        #{singleTag.trim()}{' '}
                    </span>
                ))
            }

            {((session?.user) as any)?.id === test.creator._id &&
                pathName === '/profile' && (
                    <div className='mt-5 flex-center gap-4 border-t border-gray-100 pt-3'>
                        <p className='font-inter text-md green_gradient cursor-pointer black_btn' onClick={handleEdit}>
                            Edit
                        </p>
                        <p className='font-inter text-md orange_gradient cursor-pointer black_btn' onClick={handleDelete}>
                            Delete
                        </p>
                    </div>
                )}

        </div>
    )
}

export default TestCard