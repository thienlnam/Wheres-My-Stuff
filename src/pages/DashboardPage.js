import React, {useState, useContext} from 'react';
import {Card, Button} from 'antd';
import _ from 'lodash';
import {useQuery, useMutation, useQueryClient} from 'react-query';
import {PlayCircleOutlined, CloseOutlined, PauseCircleOutlined} from '@ant-design/icons';
import SpeechRecognition, {useSpeechRecognition} from 'react-speech-recognition';
import Modal from 'react-bootstrap/Modal';
import * as API from '../api';
import * as VOICE from '../voiceHandling';
import * as Handlers from '../state/Handlers';
import {Context} from '../state/Store';

const DashboardPage = () => {
    const [state, dispatch] = useContext(Context);
    const {data} = useQuery('partContainers', API.getContainedBy);

    let itemNames = [];
    let containerNames = [];

    // Generate grammer words from list of parts and containers
    if (data) {
        data.forEach((item, index) => {
            itemNames.push(item.partName);
            containerNames.push(item.containerName);
        });
    }

    const commands = [
        {
            command: 'Test',
            callback: (item) => handleVoiceCommand('find', item),
        },
        {
            command: 'Where is (my) (the) *',
            callback: (item) => VOICE.handleVoiceCommand(VOICE.FIND, {'item': item}, dispatch, resetTranscript),
        },
        {
            command: 'Where\'s (my) (the) *',
            callback: (item) => VOICE.handleVoiceCommand(VOICE.FIND, {'item': item}, dispatch, resetTranscript),
        },
        {
            command: 'Update * quantity to :number',
            callback: (item, number) => VOICE.handleVoiceCommand(VOICE.UPDATE, {'item': item, 'quantity': number}, dispatch, resetTranscript),
        },
        {
            command: 'clear',
            callback: () => clearButtonClick(),
        },
        {
            command: VOICE.CANCEL_RESPONSES,
            callback: (response) => VOICE.handleVoiceResponses(response, state, dispatch, resetTranscript),
            isFuzzyMatch: true,
            bestMatchOnly: true,
        },
        {
            command: VOICE.NO_RESPONSES,
            callback: (response) => VOICE.handleVoiceResponses(response, state, dispatch, resetTranscript),
            isFuzzyMatch: true,
            bestMatchOnly: true,
        },
        {
            command: VOICE.YES_RESPONSES,
            callback: (response) => VOICE.handleVoiceResponses(response, state, dispatch, resetTranscript),
            isFuzzyMatch: true,
            bestMatchOnly: true,
        },
        // Match selection choices
        {
            command: '*',
            callback: (response) => VOICE.handleVoiceResponses(response, state, dispatch, resetTranscript),
            bestMatchOnly: true,
        },
    ];

    const {transcript, resetTranscript, listening} = useSpeechRecognition({commands});
    SpeechRecognition.getRecognition().lang = 'en-US';

    const clearButtonClick = () => {
        resetTranscript();
        Handlers.setMessage('', dispatch);
    };

    const VoiceControlClick = () => {
        if (!listening) {
            SpeechRecognition.startListening({continuous: false});
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
                {SpeechRecognition.browserSupportsSpeechRecognition() ? (
                    <>
                        <div style={{textAlign: 'center', verticalAlign: 'middle'}}>
                            <Button
                                onClick={VoiceControlClick}
                                type={listening ? 'danger' : 'primary'}
                                icon={listening ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                            >
                                {listening ? 'Listening...' : 'Start'}
                            </Button>
                            <Button
                                onClick={clearButtonClick}
                                className={'buttonLeftMargin'}
                                icon={<CloseOutlined />}
                                disabled={state.voiceState !== VOICE.STATE_READY ? 'disabled' : ''}
                            >
                                Clear
                            </Button>
                        </div>
                        <p style={{color: 'red'}}>
                            {state.voiceState === VOICE.STATE_PENDING_CONFIRMATION ? 'Awaiting your confirmation. Respond with YES or NO': ''}
                            {state.voiceState === VOICE.STATE_PENDING_SELECTION ? 'Awaiting your selection...': ''}
                            <br />
                            {state.errorMessage}
                        </p>
                        {transcript}
                    </>
                ) : (
                    <>
                        Unfortunately this browser does not support speech recognition.
                        Under the hood this uses the Web Speech API which currently has limited browser support.
                        Please try again with Chrome for the best experience.
                    </>
                )}
            </Card>
            <Card style={{whiteSpace: 'pre-wrap'}}>
                {state.message}
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
