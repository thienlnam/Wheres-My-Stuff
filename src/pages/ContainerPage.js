import React, {useState} from 'react';
import Table from '../components/Table';
import FormContainer from '../components/FormContainer';
import {useQuery, useMutation, useQueryClient} from 'react-query';
import {Button} from 'antd';
import Modal from 'react-bootstrap/Modal';
import * as API from '../api';

const ContainerPage = () => {
    const {data} = useQuery('containers', API.getContainers);
    const queryClient = useQueryClient();

    const updateContainerMutation = useMutation(API.updateContainer, {
        onError: (error) => {
            console.log(error);
        },
        onSuccess: (data, variables) => {
            queryClient.setQueryData('containers', (old) => old.map((container) => container.containerID === variables.containerID ? data : container));
        },
    });

    const deleteContainerMutation = useMutation(API.deleteContainer, {
        onError: (error) => {
            console.log(error);
        },
        onSuccess: () => {
            queryClient.refetchQueries('containers');
        },
    });

    const createContainerMutation = useMutation(API.createContainer, {
        onError: (error) => {
            console.log(error);
        },
        onSuccess: () => {
            queryClient.refetchQueries('containers');
        },
    });

    const formInputs = [
        {label: 'Name', name: 'name', required: true, errorMessage: 'Please enter a container name'},
        {label: 'Description', name: 'description', required: false},
        {label: 'Location', name: 'location', required: true, errorMessage: 'Please enter a container location'},
        {label: 'Size', name: 'size', type: 'number', required: false},
    ];

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
                    <Modal.Title>Containers Help</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p><b>This page is for adding/editing/removing containers to the inventory</b></p>
                    <p>Containers hold the parts that are stored in the inventory</p><br />
                    <p>Adding a container requires a name and a location, and can optionally take a description and size</p><br />
                    <p>Editing a container allows changing any of the attributes shown</p><br />
                    <p>Removing a container will ask for confirmation before removing it from the inventory</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <FormContainer title='Add a container' onSubmit={createContainerMutation.mutate} formInputs={formInputs} />
            <br /><br />
            <Table
                columns={[
                    {title: 'Name', field: 'name'},
                    {title: 'Description', field: 'description'},
                    {title: 'Location', field: 'location'},
                    {title: 'Size', field: 'size'},
                ]}
                data={data}
                title={'Container List'}
                localization={{body: {editRow: {deleteText: 'Are you sure you want to delete this container?'}}}}
                editable={{
                    isEditable: () => true,
                    isDeletable: () => true,
                    onRowUpdate: (newData, oldData) =>
                        new Promise((resolve, reject) => {
                            updateContainerMutation.mutate(newData);
                            resolve();
                        }),
                    onRowDelete: (oldData) =>
                        new Promise((resolve, reject) => {
                            deleteContainerMutation.mutate(oldData.containerID);
                            resolve();
                        }),
                }}
            />
        </div>
    );
};

export default ContainerPage;
