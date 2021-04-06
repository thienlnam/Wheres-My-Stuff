import React, {useState} from 'react';
import {Button, Modal} from 'antd';

const Modals = (props) => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <Button onClick={handleShow}>
                {props.button}
            </Button>
            <Modal
                visible={show}
                onCancel={handleClose}
                title={props.title}
                footer={
                    <Button type='primary' onClick={handleClose}>
                        Close
                    </Button>
                }>
                <div dangerouslySetInnerHTML={{ __html: props.body }} />
                </Modal>
            </>
    );
}

export default Modals;
