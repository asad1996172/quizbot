"use client";

import { useState, useEffect } from "react";

import TestCard from "./TestCard";

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
    );
};

const Feed = () => {
    const [allTests, setAllTests] = useState([]);

    // Search states
    const [searchText, setSearchText] = useState("");
    const [searchTimeout, setSearchTimeout] = useState(null);
    const [searchedResults, setSearchedResults] = useState([]);

    const fetchTests = async () => {
        const response = await fetch("/api/test");
        const data = await response.json();

        setAllTests(data);
    };

    useEffect(() => {
        fetchTests();
    }, []);

    const filterPrompts = (searchtext) => {
        const regex = new RegExp(searchtext, "i"); // 'i' flag for case-insensitive search
        return allTests.filter(
            (item) =>
                regex.test(item.creator.username) ||
                regex.test(item.tag) ||
                regex.test(item.prompt) ||
                regex.test(item.title)
        );
    };

    const handleSearchChange = (e) => {
        clearTimeout(searchTimeout);
        setSearchText(e.target.value);

        // debounce method
        setSearchTimeout(
            setTimeout(() => {
                const searchResult = filterPrompts(e.target.value);
                setSearchedResults(searchResult);
            }, 500)
        );
    };

    const handleTagClick = (tagName) => {
        setSearchText(tagName);

        const searchResult = filterPrompts(tagName);
        setSearchedResults(searchResult);
    };

    return (
        <section className='feed'>
            <form className='relative w-full flex-center'>
                <input
                    type='text'
                    placeholder='Search for a tag or a username'
                    value={searchText}
                    onChange={handleSearchChange}
                    required
                    className='search_input peer'
                />
            </form>

            {/* All Prompts */}
            {searchText ? (
                <TestCardList
                    data={searchedResults}
                    handleTagClick={handleTagClick}
                />
            ) : (
                <TestCardList data={allTests} handleTagClick={handleTagClick} />
            )}
        </section>
    );
};

export default Feed;