import React from 'react';
import Table from '../components/Table';

import {sampleItemData} from '../sampleData';

function ItemListPage() {
    return (
        <Table
            columns={[
                {title: 'Name', field: 'name'},
                {title: 'Category', field: 'category'},
                {title: 'Container', field: 'container'},
                {title: 'Location', field: 'location'},
                {title: 'Quantity', field: 'quantity'},
            ]}
            data={sampleItemData}
            title={'Item List'}
        />
    );
}

export default ItemListPage;
