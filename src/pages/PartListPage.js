import React from 'react';
import Table from '../components/Table';
import {
    Form,
    Select,
} from 'antd';
import FormContainer from '../components/FormContainer';
import {useQuery, useMutation, useQueryClient} from 'react-query';
import * as API from '../api';

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

    return (
        <div>
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
