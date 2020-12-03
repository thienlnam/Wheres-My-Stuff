import React from 'react';
import Table from '../components/Table';


import { sampleContainerData } from '../sampleData';

function ContainerPage() {
  return (
    <Table 
        columns={[
            { title: 'Name', field: 'name' },
            { title: 'Description', field: 'description' },
            { title: 'Identifier', field: 'identifier' },
            { title: 'Location', field: 'location' },
        ]}
        data={sampleContainerData}
        title={'Container List'}
    />
  );
}

export default ContainerPage;
