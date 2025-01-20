import axios from "./axios";

const deleteDataTables = () => axios.delete('/api/tablesData');

const deleteDataApi = { deleteDataTables };
export default deleteDataApi;