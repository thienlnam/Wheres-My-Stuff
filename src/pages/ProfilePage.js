import React from 'react';
import axios from 'axios';
import Table from '../components/Table';
import { useQuery } from 'react-query';

const getProfiles = async () => {
    const { data } = await axios.request({
        method: 'GET',
        url: 'http://localhost:9000/Users',
    });
    return data;
};

const ProfilesPage = () => {
    const { data } = useQuery('profiles', getProfiles);
    return (
        <div>
            <Table
                columns={[
                    { title: 'Username', field: 'username' },
                    { title: 'Password', field: 'password' },
                ]}
                data={data}
                title={'Profiles List'}
            />
        </div>
    );
};

export default ProfilesPage;
