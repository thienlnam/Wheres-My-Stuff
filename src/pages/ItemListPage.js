import React from 'react';
import axios from 'axios';
import Table from '../components/Table';
import {useQuery} from 'react-query';

const getParts = async () => {
    const {data} = await axios.request({
        method: 'GET',
        url: 'http://localhost:9000/Parts',
    });
    return data;
};

const ItemListPage = () => {
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
                title={'Item List'}
            />
        </div>
    );
};

export default ItemListPage;
