import axios from 'axios';

const url = process.env.REACT_APP_HOST;
const FileDownload = require('js-file-download');

/** ----- PART API CALLS ----- */
export const getParts = async (name = '') => {
    const {data} = await axios.request({
        method: 'GET',
        url: `${url}/Parts`,
        params: {
            name: name,
        },
    });
    return data;
};

export const updatePart = async (partData) => {
    const {data} = await axios.patch(`${url}/Parts/${partData.partID}`, partData);
    return data;
};

export const deletePart = async (partID) => {
    const {data} = await axios.delete(`${url}/Parts/${partID}`);
    return data;
};

export const createPart = async (partData) => {
    const {data} = await axios.post(`${url}/Parts`, partData);
    return data;
};

/** ----- PART API CALLS END ----- */

/** ----- CONTAINER API CALLS ----- */
export const getContainers = async () => {
    const {data} = await axios.request({
        method: 'GET',
        url: `${url}/Containers`,
    });
    return data;
};

export const updateContainer = async (containerData) => {
    const {data} = await axios.patch(`${url}/Containers/${containerData.containerID}`, containerData);
    return data;
};

export const deleteContainer = async (containerID) => {
    const {data} = await axios.delete(`${url}/Containers/${containerID}`);
    return data;
};

export const createContainer = async (containerData) => {
    const {data} = await axios.post(`${url}/Containers`, containerData);
    return data;
};
/** ----- CONTAINER API CALLS END ----- */

/** ----- CONTAINED BY API CALLS ----- */
export const getContainedBy = async () => {
    const {data} = await axios.request({
        method: 'GET',
        url: `${url}/Parts/Containers`,
    });
    return data;
};

export const updateContainedBy = async (partContainerData) => {
    const {data} = await axios.patch(`${url}/Parts/${partContainerData.partID}/Containers/${partContainerData.containerID}`, partContainerData);
    return data;
};

export const deleteContainedBy = async (partContainerData) => {
    const {data} = await axios.delete(`${url}/Parts/${partContainerData.partID}/Containers/${partContainerData.containerID}`);
    return data;
};

export const createContainedBy = async (partContainerData) => {
    console.log(partContainerData);
    const {data} = await axios.post(`${url}/Parts/${partContainerData.partID}/Containers/${partContainerData.containerID}`, partContainerData);
    return data;
};

/** ----- CONTAINED BY API CALLS END ----- */

/** ----- EXPORT API CALL ----- */
export const exportData = async () => {
    const { data } = await axios.request({
        method: 'GET',
        url: `${url}/Export`,
        responseType: 'blob',
    });
    FileDownload(data, 'output.csv');
};
/** ----- EXPORT API CALL END ----- */
