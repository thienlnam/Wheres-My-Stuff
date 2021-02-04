import React, {useState} from 'react';
import {Tag} from 'antd';

const AddCategories = () => {
    const [categoryList, setCategoryList] = useState(['example', 'test1', 'test2']);

    const removeFromList = (e, itemIndex) => {
        e.preventDefault();
        setCategoryList(categoryList.filter((current, index) => index !== itemIndex));
    };

    return (
        <div>
            {categoryList.map((category, index) => {
                return (
                    <Tag key={category} closable onClose={(e) => removeFromList(e, index)}>{category}</Tag>
                );
            })}
        </div>
    );
};

export default AddCategories;
