import React from 'react';
import axios from 'axios';
import Table from '../components/Table';
import {useQuery} from 'react-query';

const getContainers = async () => {
    const {data} = await axios.request({
        method: 'GET',
        url: 'http://localhost:9000/Containers',
    });
    return data;
};

const ContainerPage = () => {
    const {data} = useQuery('containers', getContainers);
    return (
        <Table
            columns={[
                {title: 'Name', field: 'name'},
                {title: 'Description', field: 'description'},
                {title: 'Location', field: 'location'},
                {title: 'PartID', field: 'partID'},
                {title: 'Quantity', field: 'quantity'},
                {title: 'Size', field: 'size'},
            ]}
            data={data}
            title={'Container List'}
        />
    );
};

export default ContainerPage;
