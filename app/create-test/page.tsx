"use client";

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FormEvent } from 'react';

import Form from '@components/Form';
import Spinner from '@components/Spinner';

const CreateTest = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [submitting, setSubmitting] = useState(false);
  const [test, setTest] = useState({
    'title': '',
    'prompt': '',
    'tag': '',
  });

  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push('/');
    }
  }, [session, status])

  const CreateTest = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('/api/test/new', {
        method: 'POST',
        body: JSON.stringify({
          prompt: test.prompt,
          userId: (session?.user as any)?.id,
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

  if (!session) {
    return <Spinner />;
  }

  return (
    <Form
      type="Create"
      test={test}
      setTest={setTest}
      submitting={submitting}
      handleSubmit={CreateTest}
    />
  )
}

export default CreateTest