import React, {useState} from 'react';
import {Card, Button} from 'antd';
import _ from 'lodash';
import {PlayCircleOutlined, CloseOutlined, PauseCircleOutlined} from '@ant-design/icons';
import SpeechRecognition, {useSpeechRecognition} from 'react-speech-recognition';
import Modal from 'react-bootstrap/Modal';
import * as API from '../api';

const DashboardPage = () => {
    const commands = [
        {
            command: 'Test',
            callback: (item) => handleVoiceCommand('find', item),
        },
        {
            command: 'Where is (my) (the) *',
            callback: (item) => handleVoiceCommand('find', item),
        },
        {
            command: 'Where\'s (my) (the) *',
            callback: (item) => handleVoiceCommand('find', item),
        },
        {
            command: 'What items are (inside) (in) (the) *',
            callback: (container) => setMessage(`Inside the ${container} is a Screw A, and Screw B.`),
        },
        {
            command: 'How many items are (there) in the *',
            callback: (location) => setMessage(`There are 2 items in the ${location}`),
        },
        {
            command: 'clear',
            callback: () => clearButtonClick(),
        },
    ];

    const handleVoiceCommand = async (commandType, item) => {
        if (commandType === 'find') {
            const result = await API.getParts(item);
            if (!result) {
                setMessage(`Sorry, I wasn't able to find any instances of ${item}`);
            } else {
                // Group the items by name
                let message = '';
                const grouped = _.groupBy(result, 'partName');

                // Count number of returned items (unique item names)
                if (Object.keys(grouped).length > 1) {
                    message += `I was able to find ${Object.keys(grouped).length} items that include ${item}.\n\n`;
                }

                // Loop through the grouped items and create message details
                Object.entries(grouped).forEach((item) => {
                    const itemName = item[0];
                    const itemOccurances = item[1].length;
                    message += `You have ${itemOccurances} location(s) where ${itemName} exists.\n`;

                    item[1].forEach((detail) => {
                        console.log('detail:', detail);
                        const containerName = detail.containerName;
                        const containerLocation = detail.location;
                        message += `${detail.quantity} in the ${containerName} ${containerLocation ?
                            ` located in the ${containerLocation}.` :
                            '.'}\n`;
                    });
                    message += '\n';
                });
                setMessage(message);
            }
        } else {
            setMessage(`Sorry, I cannot handle that request yet!`);
        }
    };

    const {transcript, resetTranscript} = useSpeechRecognition({commands});
    const [isListening, updateIsListening] = useState(false);
    const [message, setMessage] = useState('');

    const exportData = async () => {
        return await API.exportData();
    };

    const clearButtonClick = () => {
        resetTranscript();
        setMessage('');
    };

    const VoiceControlClick = () => {
        updateIsListening(!isListening);

        if (!isListening) {
            SpeechRecognition.startListening({continuous: true});
        } else {
            SpeechRecognition.stopListening();
        }
    };

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [showCommand, setShowCommand] = useState(false);

    const handleCloseCommand = () => setShowCommand(false);
    const handleShowCommand = () => setShowCommand(true);

    return (
        <div className="site-card-wrapper">
            <Button onClick={handleShow}>
                ?
            </Button>
            <Button onClick={handleShowCommand}>
                Commands
            </Button>

            <Modal show={show} onHide={handleClose} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Voice Commands Help</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p><b>This page is for using voice commands and exporting/importing inventory information</b></p><br />
                    <p>To start the voice command, click the start button and speech your command</p><br />
                    <p>To clear the transcript, click the reset button</p><br />
                    <p>The export button will save a .csv file with the information of the inventory. This can be used as a backup file</p><br />
                    <p>The import button will prompt for a .csv file and attempt to import the data into the inventory</p><br />
                    <p>*Note: If voice is not be detected, allow the site to use your microphone by clicking the icon to the left of the URL and allowing microphone use</p><br />
                    <p><b>Tip:</b> When naming multiple similar objects use letters instead of numbers i.e. (Screw A, Screw B, Screw H)</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <Modal show={showCommand} onHide={handleCloseCommand} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Voice Commands Help</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p><b>These are the supported voice commands</b></p><br />
                    <p><b>Find:</b> Find a Part with the below commands:</p>
                    <ul>
                        <li>Where's my/the (Part)?</li>
                        <li>Where is my/the (Part)?</li>
                    </ul>
                    <p><b>Update:</b> Update a Part with the below commands:</p>
                    <ul>
                        <li>Update (Part) quantity to (Number)</li>
                    </ul>
                    
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleCloseCommand}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <Card title="Voice Control" bordered={false}>
                <div style={{textAlign: 'center', verticalAlign: 'middle'}}>
                    <Button
                        onClick={VoiceControlClick}
                        type={isListening ? 'danger' : 'primary'}
                        icon={isListening ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                    >
                        {isListening ? 'Stop' : 'Start'}
                    </Button>
                    <Button onClick={clearButtonClick} className={'buttonLeftMargin'} icon={<CloseOutlined />}>
                        Clear
                    </Button>
                </div>
                {transcript}
            </Card>
            <Card style={{whiteSpace: 'pre-wrap'}}>
                {message}
            </Card>
            <br /><br />
            <Card title="Export Your Data to CSV" bordered={false}>
                <div style={{textAlign: 'center', verticalAlign: 'middle'}}>
                    <Button onClick={exportData} className={'buttonLeftMargin'}>
                        Export Data
                    </Button>
                </div>
            </Card>
        </div>

    );
};

export default DashboardPage;
