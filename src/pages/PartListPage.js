import React from 'react';
import axios from 'axios';
import Table from '../components/Table';
import { useQuery, useMutation, useQueryClient } from 'react-query';

const url = process.env.REACT_APP_HOST;

const getParts = async () => {
    const {data} = await axios.request({
        method: 'GET',
        url: url + '/Parts',
    });
    return data;
};

const updatePart = async (partData) => {
    const {data} = await axios.patch(url + `/Parts/${partData.partID}`, partData);
    return data;
};

const deletePart = async (partID) => {
    const {data} = await axios.delete(url + `/Parts/${partID}`);
    return data;
};

const PartListPage = () => {
    const queryClient = useQueryClient();
    const {data} = useQuery('parts', getParts);
    const updatePartMutation = useMutation(updatePart, {
        onError: (error, variables, context) => {
            // An error happened!
            console.log(error);
            console.log(`Error with updating part with partID: ${context.id}`);
        },
        onSuccess: (data, variables, context) => {
            queryClient.setQueryData('parts', (old) => old.map((part) => part.partID === variables.partID ? data : part));
        },
    });

    const deletePartMutation = useMutation(deletePart, {
        onError: (error, variables, context) => {
            // An error happened!
            console.log(error);
            console.log(`Error with deleting part with partID: ${context.id}`);
        },
        onSuccess: (data, variables, context) => {
            queryClient.refetchQueries('parts');
        },
    });


    return (
        <div>
            <Table
                columns={[
                    {title: 'Name', field: 'name'},
                    {title: 'Category', field: 'category'},
                    {title: 'Container', field: 'container'},
                    {title: 'Location', field: 'partLocation'},
                    {title: 'Quantity', field: 'partQuantity'},
                ]}
                data={data}
                title={'Parts List'}
                localization={{body: {editRow: {deleteText: 'Are you sure you want to delete this part?'}}}}
                editable={{
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
