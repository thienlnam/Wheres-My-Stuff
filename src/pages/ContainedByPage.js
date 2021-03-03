import React from 'react';
import Table from '../components/Table';
import {useQuery, useMutation, useQueryClient} from 'react-query';
import * as API from '../api';

const ContainedByPage = () => {
    const queryClient = useQueryClient();
    const {data} = useQuery('partContainers', API.getPartContainers);
    const updatePartMutation = useMutation(API.updatePartContainer, {
        onError: (error) => {
            console.log(error);
        },
        onSuccess: (data, variables) => {
            queryClient.setQueryData('partContainers', (old) => old.map((part) => part.partID === variables.partID & part.containerID === variables.containerID ? data : part));
        },
    });

    const deletePartContainerMutation = useMutation(API.deletePartContainer, {
        onError: (error) => {
            console.log(error);
        },
        onSuccess: () => {
            queryClient.refetchQueries('partContainers');
        },
    });

    return (
        <div>
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
                            deletePartContainerMutation.mutate(oldData);
                            resolve();
                        }),
                }}
            />
        </div>
    );
};

export default ContainedByPage;
