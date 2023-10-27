"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import Profile from '@components/Profile';

import React from 'react'

const MyProfile = () => {
  const router = useRouter();

  const { data: session } = useSession();
  const [myTests, setMyTests] = useState([]);

  useEffect(() => {
    const fetchTests = async () => {
      const userId = (session?.user as any)?.id;
      const response = await fetch(`/api/users/${userId}/tests`);
      const data = await response.json();

      setMyTests(data);
    }

    const userId = (session?.user as any)?.id;
    if (userId) fetchTests();
  }, [(session?.user as any)?.id])

  const handleEdit = (test) => {
    router.push(`/update-test?id=${test._id}`);
  }

  const handleDelete = async (test) => {
    const hasConfirmed = confirm('Are you sure you want to delete this test?');
    if (hasConfirmed) {
      try {
        await fetch(`/api/test/${test._id.toString()}`, {
          method: 'DELETE',
        });

        const filteredPosts = myTests.filter((myTest) => myTest._id !== test._id);
        setMyTests(filteredPosts);
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <Profile
      name="My"
      desc="Welcome to your personalized profile page"
      data={myTests}
      handleEdit={handleEdit}
      handleDelete={handleDelete}
    />
  )
}

export default MyProfile