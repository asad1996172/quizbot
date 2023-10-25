"use client";

import { useState, useEffect } from 'react';
import TestCard from './TestCard';

const TestCardList = ({ data, handleTagClick }) => {
    return (
        <div className='mt-16 prompt_layout'>
            {data.map((test) => (
                <TestCard
                    key={test._id}
                    test={test}
                    handleTagClick={handleTagClick}
                    handleEdit={() => { }}
                    handleDelete={() => { }}
                />
            ))}
        </div>
    )
}

const Feed = () => {
    const [searchText, setSearchText] = useState('');
    const [posts, setPosts] = useState([]);

    const handleSearchChange = (e) => {
        e.preventDefault();
        setSearchText(e.target.value);
    }

    useEffect(() => {
        const fetchPosts = async () => {
            const response = await fetch(`/api/test`);
            const data = await response.json();

            setPosts(data);
        }
        fetchPosts();
    }, [])

    return (
        <section className='feed'>
            <form
                className='relative w-full flex-container'
            >
                <input
                    type='text'
                    placeholder='Search by tag, username or test prompt'
                    value={searchText}
                    onChange={handleSearchChange}
                    className='search_input peer'
                    required
                >
                </input>
            </form>

            <TestCardList
                data={posts}
                handleTagClick={(tag) => { setSearchText(tag) }}
            />

        </section>
    )
}

export default Feed