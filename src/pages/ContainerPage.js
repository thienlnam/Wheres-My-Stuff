import React from 'react';
import Table from '../components/Table';
import FormContainer from '../components/FormContainer';
import {useQuery, useMutation, useQueryClient} from 'react-query';
import * as API from '../api';
import * as Constants from '../utility/constants';
import Modals from '../components/Modals';

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

    return (
        <div>
            <Modals title={Constants.CONTAINER_HELP_TITLE} body={Constants.CONTAINER_HELP_BODY} button='?'/>

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
