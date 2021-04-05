import React, {useState} from 'react';
import axios from 'axios';
import Table from '../components/Table';
import {useQuery, useMutation, useQueryClient} from 'react-query';
import {Button} from 'antd';
import FormContainer from '../components/FormContainer';
import * as API from '../api';
import Modal from 'react-bootstrap/Modal';

const CategoryPage = () => {
    const queryClient = useQueryClient();
    const {data} = useQuery('categories', () => API.getCategories());

    const createCategoryMutation = useMutation(API.createCategory, {
        onError: (error) => {
            console.log(error);
        },
        onSuccess: () => {
            queryClient.refetchQueries('categories');
        },
    });

    const updateCategoryMutation = useMutation(API.updateCategory, {
        onError: (error) => {
            console.log(error);
        },
        onSuccess: (data, variables) => {
            queryClient.setQueryData('categories', (old) => old.map((category) => category.categoryID === variables.categoryID ? data : category));
            queryClient.refetchQueries('categories');
        },
    });
    const deleteCategoryMutation = useMutation(API.deleteCategory, {
        onError: (error) => {
            console.log(error);
        },
        onSuccess: () => {
            queryClient.refetchQueries('categories');
        },
    });

    const formInputs = [
        {label: 'Name', name: 'name', required: true, errorMessage: 'Please enter an item name!'},
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
                    <Modal.Title>Categories Help</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p><b>This page is for adding/editing/removing part categories</b></p>
                    <p>Categories help to group parts into alike categories</p><br />
                    <p>Adding a category requires a name</p><br />
                    <p>Editing a category allows the name to be changed. This reflects on the Parts page</p><br />
                    <p>Removing a category will remove it from all associated parts</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <FormContainer title='Add a Category' onSubmit={createCategoryMutation.mutate} formInputs={formInputs}/>

            <Table
                columns={[
                    {title: 'Name', field: 'name'},
                ]}
                data={data}
                title={'Categories List'}
                localization={{body: {editRow: {deleteText: 'Are you sure you want to delete this category?'}}}}
                editable={{
                    isEditable: () => true,
                    isDeletable: () => true,
                    onRowUpdate: (newData, oldData) =>
                        new Promise((resolve, reject) => {
                            updateCategoryMutation.mutate(newData);
                            resolve();
                        }),
                    onRowDelete: (oldData) =>
                        new Promise((resolve, reject) => {
                            deleteCategoryMutation.mutate(oldData.categoryID);
                            resolve();
                        }),
                }}
            />
        </div>
    );
};

export default CategoryPage;
