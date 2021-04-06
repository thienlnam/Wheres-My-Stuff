import React from 'react';
import Table from '../components/Table';
import {useQuery, useMutation, useQueryClient} from 'react-query';
import FormContainer from '../components/FormContainer';
import * as API from '../api'
import Modals from '../components/Modals';
import * as Constants from '../utility/constants';

const CategoryPage = () => {
    const queryClient = useQueryClient();
    const {data} = useQuery('categories', () => API.getCategories());

    const createCategoryMutation = useMutation(API.createCategory, {
        onError: (error) => {
            console.log(error);
        },
        onSuccess: () => {
            queryClient.refetchQueries('categories');
        }
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
        { label: 'Name', name: 'name', required: true, errorMessage: 'Please enter an item name!' },
    ];

    return (
        <div>
            <Modals title={Constants.CATEGORY_HELP_TITLE} body={Constants.CATEGORY_HELP_BODY} button='?'/>

            <FormContainer title='Add a Category' onSubmit={createCategoryMutation.mutate} formInputs={formInputs}/>

            <Table
                columns={[
                    {title: 'Name', field: 'name'},
                ]}
                data={data}
                title={'Categories List'}
                localization={{ body: { editRow: { deleteText: 'Are you sure you want to delete this category?' } } }}
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
