import React, { useState } from 'react';
import Table from '../components/Table';
import {
    Form,
    Select,
    Button,
} from 'antd';
import FormContainer from '../components/FormContainer';
import {useQuery, useMutation, useQueryClient} from 'react-query';
import * as API from '../api';
import Modal from 'react-bootstrap/Modal';

const PartListPage = () => {
    const queryClient = useQueryClient();
    const queryMultiple = () => {
        const {data} = useQuery('parts', () => API.getParts());
        const categoryDataSelect = useQuery('catagories', () => API.getCategories());
        return [data, categoryDataSelect];
    };

    const [data, categoryData] = queryMultiple();

    const updatePartMutation = useMutation(API.updatePart, {
        onError: (error) => {
            console.log(error);
        },
        onSuccess: (data, variables) => {
            if (data.addRemoveCategory) {
                if (data.categories.indexOf(categories[data.addRemoveCategory]) == -1) {
                    API.createCategorizedBy(data.partID, data.addRemoveCategory);
                } else {
                    API.removeCategorizedBy(data.partID, data.addRemoveCategory);
                }
            }
            queryClient.setQueryData('parts', (old) => old.map((part) => part.partID === variables.partID ? data : part));
            queryClient.refetchQueries('parts');
        },
    });

    const deletePartMutation = useMutation(API.deletePart, {
        onError: (error) => {
            console.log(error);
        },
        onSuccess: () => {
            queryClient.refetchQueries('parts');
        },
    });

    const createPartMutation = useMutation(API.createPart, {
        onError: (error) => {
            console.log(error);
        },
        onSuccess: (partData, categoryData) => {
            if (categoryData.categoryID) {
                API.createCategorizedBy(partData.id, categoryData.categoryID);
            }
            queryClient.refetchQueries('parts');
        },
    });

    const formInputs = [
        {label: 'Name', name: 'name', required: true, errorMessage: 'Please enter an item name!'},
    ];

    let categoryDataSelect = '';
    let categories = {};
    if (categoryData.data) {
        categoryDataSelect = categoryData.data.map((category) => {
            const categoryName = category.name;
            const categoryID = category.categoryID;
            categories[categoryID] = categoryName;
            return <Select.Option key={categoryID} value={categoryID}>{category.name}</Select.Option>;
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
                    <Modal.Title>Parts Help</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p><b>This page is for adding/editing/removing parts from the inventory</b></p>
                    <p>Parts are the components and individual parts in the inventory</p><br />
                    <p>Add an item by specifying a name and optionally a category it belongs to</p><br />
                    <p>Editing an item will allow the changing of the name or adding/removing categories to the item</p><br />
                    <p>Deleting an item will remove it from the inventory and will reflect on the Part Locations page</p><br />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <FormContainer title='Add an item' onSubmit={createPartMutation.mutate} formInputs={formInputs}>
            <Form.Item
                label="Category"
                name="categoryID"
            >
                <Select
                    dropdownStyle={{ minWidth: '30%' }}
                    placeholder="Category"
                >
                    {categoryDataSelect}
                </Select>
                </Form.Item>
            </FormContainer>
            <br /><br />
            <Table
                columns={[
                    {title: 'Name', field: 'name'},
                    {title: 'Category', field: 'categories'},
                    {title: 'Add/Remove Category', field: 'addRemoveCategory', lookup: categories},   
                ]}
                data={data}
                title={'Parts List'}
                localization={{body: {editRow: {deleteText: 'Are you sure you want to delete this part?'}}}}
                editable={{
                    isEditable: () => true,
                    isDeletable: () => true,
                    onRowUpdate: (newData, oldData) =>
                        new Promise((resolve, reject) => {
                            updatePartMutation.mutate(newData);
                            resolve();
                        }),
                    onRowDelete: (oldData) =>
                        new Promise((resolve, reject) => {
                            deletePartMutation.mutate(oldData.partID);
                            resolve();
                        }),
                }}
            />
        </div>
    );
};

export default PartListPage;
