import React from 'react';
import Table from '../components/Table';
import FormContainer from '../components/FormContainer';
import {useQuery, useMutation, useQueryClient} from 'react-query';
import * as API from '../api';

const PartListPage = () => {
    const queryClient = useQueryClient();
    const {data} = useQuery('parts', () => API.getParts());

    const updatePartMutation = useMutation(API.updatePart, {
        onError: (error) => {
            console.log(error);
        },
        onSuccess: (data, variables) => {
            queryClient.setQueryData('parts', (old) => old.map((part) => part.partID === variables.partID ? data : part));
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
        onSuccess: () => {
            queryClient.refetchQueries('parts');
        },
    });

    const formInputs = [
        {label: 'Name', name: 'name', required: true, errorMessage: 'Please enter an item name!'},
    ];

    return (
        <div>
            <FormContainer title='Add an item' onSubmit={createPartMutation.mutate} formInputs={formInputs} />
            <br /><br />
            <Table
                columns={[
                    {title: 'Name', field: 'name'},
                    {title: 'Category', field: 'categories'},
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
