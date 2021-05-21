import React from 'react';
import axios from 'axios';
import Table from '../components/Table';
import {useQuery} from 'react-query';
import * as Constants from '../utility/constants';
import Modals from '../components/Modals';

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
            <Modals title={Constants.PROFILE_HELP_TITLE} body={Constants.PROFILE_HELP_BODY} button='Help'/>

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
