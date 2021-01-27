import React from 'react';
import axios from 'axios';
import Table from '../components/Table';
import { useQuery } from 'react-query';

require('dotenv').config({ path: '../.env' });

const getParts = async () => {
    const {data} = await axios.request({
        method: 'GET',
        url: 'http://localhost:9000/Parts',
    });
    return data;
};

const PartListPage = () => {
    const {data} = useQuery('parts', getParts);
    return (
        <div>
            <Table
                columns={[
                    {title: 'Name', field: 'name'},
                    {title: 'Category', field: 'category'},
                    {title: 'Container', field: 'container'},
                    {title: 'Location', field: 'partLocation'},
                    {title: 'Quantity', field: 'partQuantity'},
                ]}
                data={data}
                title={'Parts List'}
            />
        </div>
    );
};

export default PartListPage;
