import axios from './axios';

const fetchChapters = courseCode => axios.get(`/api/courses/${courseCode}/chapters`);
const addChapter = (courseCode, data) => axios.post(`/api/courses/${courseCode}/chapters`, data, {
    headers: {
        'Content-Type': 'multipart/form-data'
    }
});
const downloadChapter = chapterId => axios.get(`/api/chapters/${chapterId}/download`, {
    responseType: 'blob',
});
const deleteChapter = chapterId => axios.delete(`/api/chapters/${chapterId}`);
const viewChapter = chapterId => axios.get(`/api/chapters/${chapterId}/view`, {
    responseType: 'blob',
});

const chaptersApi = { fetchChapters, addChapter, downloadChapter, deleteChapter, viewChapter };
export default chaptersApi;