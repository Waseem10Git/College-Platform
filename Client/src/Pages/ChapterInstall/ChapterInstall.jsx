import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChapterInstall = (props) => {
    const [chapterId, setChapterId] = useState(props.match.params.id); // Get chapter ID from URL parameter
    const [chapterInfo, setChapterInfo] = useState(null);

    useEffect(() => {
        const fetchChapterInfo = async () => {
            try {
                const response = await axios.get(`/chapters/${chapterId}`);
                setChapterInfo(response.data);
            } catch (error) {
                console.error('Error fetching chapter information:', error);
            }
        };
        fetchChapterInfo();
    }, [chapterId]);

    const handleInstallClick = async () => {
        try {
            const response = await axios.post(`/chapters/install/${chapterId}`);
            console.log('Chapter installation triggered:', response.data);
        } catch (error) {
            console.error('Error installing chapter:', error);
        }
    };

    // Return statement with conditional rendering
    return (
        <div>
            {chapterInfo ? (
                <>
                    <h1>Install Chapter: {chapterInfo.chapter_name}</h1>
                    <button onClick={handleInstallClick}>Install Chapter</button>
                </>
            ) : (
                <p>Loading chapter information...</p>
            )}
        </div>
    );
};

export default ChapterInstall;
