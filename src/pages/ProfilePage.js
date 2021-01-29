import React from 'react';
import axios from 'axios';
import Table from '../components/Table';
import {useQuery} from 'react-query';

const url = process.env.REACT_APP_HOST;

const getProfiles = async () => {
    const {data} = await axios.request({
        method: 'GET',
        url: url + '/Users',
    });
    return data;
};

const ProfilesPage = () => {
    const {data} = useQuery('profiles', getProfiles);
    return (
        <div>
            <Table
                columns={[
                    {title: 'Username', field: 'username'},
                    {title: 'Password', field: 'password'},
                ]}
                data={data}
                title={'Profiles List'}
            />
        </div>
    );
};

export default ProfilesPage;
