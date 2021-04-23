import React from 'react';
import {Card, Form, Input, Button} from 'antd';
import PropTypes from 'prop-types';

const FormContainer = (props) => {
    const [form] = Form.useForm();
    const formInputs = props.formInputs.map((input, index) => {
        return (
            <Form.Item
                key={index}
                label={input.label}
                name={input.name}
                rules={[{required: input.required, message: input.errorMessage ?? ''}]}
            >
                <Input
                    type={input.type ?? 'text'}
                    placeholder={input.placeholder ?? ''} />
            </Form.Item>
        );
    });

    const onSubmit = (values) => {
        props.onSubmit(values);
        form.resetFields();
    };

    return (
        <Card title={props.title}>
            <Form
                form={form}
                layout='inline'
                onFinish={(values) => onSubmit(values)}
            >
                {props.children}
                {formInputs}
                <Form.Item>
                    <Button type="primary" htmlType="submit">Submit</Button>
                </Form.Item>
            </Form>
        </Card>
    );
};

FormContainer.propTypes = {
    formInputs: PropTypes.array.isRequired,
    onSubmit: PropTypes.any.isRequired,
    title: PropTypes.string.isRequired,
    children: PropTypes.node,
};

export default FormContainer;
