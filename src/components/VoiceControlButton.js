import React from 'react';
import {Button} from 'antd';
import PropTypes from 'prop-types';

const VoiceControlButton = (props) => {
    return (
        <Button
            onClick={props.onClick}
            style={{margin: '10px'}}
        >
            {props.text}
        </Button>
    );
};

VoiceControlButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    text: PropTypes.string.isRequired,
};

export default VoiceControlButton;
