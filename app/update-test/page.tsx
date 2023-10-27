"use client";

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation';

import Form from '@components/Form';

const EditTest = () => {
    const searchParams = useSearchParams();
    const testId = searchParams.get('id')

    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
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

        if (testId) getTestDetails();
    }, [testId])

    const updateTest = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        if (!testId) alert('Test ID not found');

        try {
            const response = await fetch(`/api/test/${testId}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    prompt: test.prompt,
                    tag: test.tag,
                    title: test.title,
                })
            })
            if (response.ok) {
                router.push('/');
            }
        } catch (error) {
            console.log(error);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Form
            type="Edit"
            test={test}
            setTest={setTest}
            submitting={submitting}
            handleSubmit={updateTest}
        />
    )
}

export default EditTest