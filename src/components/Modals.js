import React, {useState} from 'react';
import {Button, Modal} from 'antd';
import DOMPurify from 'dompurify';

const Modals = (props) => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    function cleanHtml() {
       return DOMPurify.sanitize(props.body);
    }

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
                <div dangerouslySetInnerHTML={{ __html: cleanHtml() }} />
                </Modal>
            </>
    );
}

export default Modals;
