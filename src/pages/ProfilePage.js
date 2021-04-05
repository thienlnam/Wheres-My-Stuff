import React, {useState} from 'react';
import axios from 'axios';
import Table from '../components/Table';
import {useQuery} from 'react-query';
import {Button} from 'antd';
import Modal from 'react-bootstrap/Modal';

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

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <div>
            <Button onClick={handleShow}>
                ?
            </Button>

            <Modal show={show} onHide={handleClose} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Profiles Help</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p><b>This page is for viewing profiles</b></p>
                    <p>***Features not implemented***</p>
                    <p>Modifying aspects of users and permissions</p>
                    <p>Restrict access to the system to allowed users</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

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
