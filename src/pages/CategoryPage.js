import React from 'react';
import axios from 'axios';
import Table from '../components/Table';
import {useQuery} from 'react-query';

const url = process.env.REACT_APP_HOST;

const getCategories = async () => {
    const {data} = await axios.request({
        method: 'GET',
        url: url + '/Categories',
    });
    return data;
};

const CategoryPage = () => {
    const {data} = useQuery('categories', getCategories);
    return (
        <div>
            <Table
                columns={[
                    {title: 'Name', field: 'name'},
                ]}
                data={data}
                title={'Categories List'}
            />
        </div>
    );
};

export default CategoryPage;
