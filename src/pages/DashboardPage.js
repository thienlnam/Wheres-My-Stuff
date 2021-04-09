import React, {useContext} from 'react';
import {Card, Button} from 'antd';
import _ from 'lodash';
import {PlayCircleOutlined, CloseOutlined, PauseCircleOutlined} from '@ant-design/icons';
import SpeechRecognition, {useSpeechRecognition} from 'react-speech-recognition';
import * as API from '../api';
import * as Constants from './../utility/constants';
import Modals from '../components/Modals';
import * as VOICE from '../voiceHandling';
import * as Handlers from '../state/Handlers';
import {Context} from '../state/Store';
import VoiceControlButton from '../components/VoiceControlButton';


const DashboardPage = () => {
    const [state, dispatch] = useContext(Context);

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

    const voiceButtonData = VOICE.generateVoiceButtons(state);

    const clearButtonClick = () => {
        resetTranscript();
        Handlers.setMessage('', dispatch);
    };

    const VoiceControlClick = () => {
        if (!listening) {
            SpeechRecognition.startListening({
                continuous: false,
                language: 'en-US',
            });
        } else {
            SpeechRecognition.stopListening();
        }
    };

    const exportData = async () => {
        return await API.exportData();
    };

    return (
        <div className="site-card-wrapper">
            <Modals title={Constants.DASH_HELP_TITLE} body={Constants.DASH_HELP_BODY} button='?' />
            <Modals title={Constants.DASH_COMMANDS_TITLE} body={Constants.DASH_COMMANDS_BODY} button='Commands'/>
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
            {
                voiceButtonData.length > 1 && (
                    <Card>
                        {
                            voiceButtonData.map((value) => {
                                return (
                                    <VoiceControlButton
                                        key={value.buttonText}
                                        text={value.buttonText}
                                        onClick={() => VOICE.handleVoiceResponses(`${value.data}`, state, dispatch, resetTranscript)}
                                    />
                                );
                            })
                        }
                    </Card>
                )
            }
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
