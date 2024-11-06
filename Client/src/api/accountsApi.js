import axios from './axios'

const uploadAccounts = data => axios.post('/api/upload-accounts', data, {
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});
const updateAccount = data => axios.post(`/api/update-account`, data);
const addAccount = data => axios.post(`/api/add-account`, data);
const deleteAccount = id => axios.post(`/api/delete-account/${id}`);

const accountsApi = { uploadAccounts, updateAccount, addAccount, deleteAccount }
export default accountsApi;