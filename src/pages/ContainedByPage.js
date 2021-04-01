import React, {useState} from 'react';
import Table from '../components/Table';
import {useQuery, useMutation, useQueryClient} from 'react-query';
import * as API from '../api';
import {
    Form,
    Select,
    Button,
} from 'antd';
import Modal from 'react-bootstrap/Modal';
import FormContainer from '../components/FormContainer';

const ContainedByPage = () => {
    const queryClient = useQueryClient();
    const queryMultiple = () => {
        const {data} = useQuery('partContainers', API.getContainedBy);
        const containerData = useQuery('containers', API.getContainers);
        const partsData = useQuery('parts', () => API.getParts());
        return [data, containerData, partsData];
    };

    const [data, containerData, partsData] = queryMultiple();

    const updatePartMutation = useMutation(API.updateContainedBy, {
        onError: (error) => {
            console.log(error);
        },
        onSuccess: (data, variables) => {
            queryClient.setQueryData('partContainers', (old) => old.map((part) => part.partID === variables.partID & part.containerID === variables.containerID ? data : part));
        },
    });

    const deleteContainedByMutation = useMutation(API.deleteContainedBy, {
        onError: (error) => {
            console.log(error);
        },
        onSuccess: () => {
            queryClient.refetchQueries('partContainers');
        },
    });

    const createContainedByMutation = useMutation(API.createContainedBy, {
        onError: (error) => {
            console.log(error);
        },
        onSuccess: () => {
            queryClient.refetchQueries('partContainers');
        },
    });

    const formInputs = [
        {label: 'Identifier', name: 'identifier', required: false},
        {label: 'Quantity', name: 'quantity', required: true, type: 'number', errorMessage: 'Please enter an item name!'},
    ];

    let containerDataSelect = '';
    if (containerData.data) {
        containerDataSelect = containerData.data.map((container) => {
            const containerID = container.containerID;
            return <Select.Option key={containerID} value={containerID}>{container.name}</Select.Option>;
        });
    }

    let partsDataSelect = '';
    if (partsData.data) {
        partsDataSelect = partsData.data.map((part) => {
            const partID = part.partID;
            return <Select.Option key={partID} value={partID}>{part.name}</Select.Option>;
        });
    }

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
                    <Modal.Title>Part Locations Help</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p><b>This page is for adding/editing/removing parts to containers in the inventory</b></p><br />
                    <p>The part locations show the container a part is in and the quantity</p><br />
                    <p>Adding a part to a container requires choosing a part and a container as well as a quantity, optionally add an identifier</p><br />
                    <p>Editing a location allows editing of the identifer and quantity</p><br />
                    <p>Removing a location does not remove the part and container, only the relationship between them is removed</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <FormContainer title="Add Part To Container" onSubmit={createContainedByMutation.mutate} formInputs={formInputs}>
                <Form.Item
                    label="Part"
                    name="partID"
                >
                    <Select
                        dropdownStyle={{minWidth: '30%'}}
                        placeholder="Part Name"
                    >
                        {partsDataSelect}
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Container"
                    name="containerID"
                >
                    <Select
                        dropdownStyle={{minWidth: '30%'}}
                        placeholder="Container Name"
                    >
                        {containerDataSelect}
                    </Select>
                </Form.Item>
            </FormContainer>
            <br/><br/>
            <Table
                columns={[
                    {title: 'Name', field: 'partName', editable: 'never'},
                    {title: 'Container', field: 'containerName', editable: 'never'},
                    {title: 'Identifier', field: 'identifier'},
                    {title: 'Quantity', field: 'quantity'},
                ]}
                data={data}
                title={'Part Locations'}
                options={{
                    grouping: true,
                }}
                localization={{body: {editRow: {deleteText: 'Are you sure you want to remove this part from the container?'}}}}
                editable={{
                    isEditable: () => true,
                    isDeletable: () => true,
                    onRowUpdate: (newData, oldData) =>
                        new Promise((resolve, reject) => {
                            console.log(newData);
                            updatePartMutation.mutate(newData);
                            resolve();
                        }),
                    onRowDelete: (oldData) =>
                        new Promise((resolve, reject) => {
                            deleteContainedByMutation.mutate(oldData);
                            resolve();
                        }),
                }}
            />
        </div>
    );
};

export default ContainedByPage;
