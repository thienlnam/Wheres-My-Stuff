import React, {useState} from 'react';
import {Card, Button} from 'antd';
import {PlayCircleOutlined, CloseOutlined, PauseCircleOutlined} from '@ant-design/icons';
import SpeechRecognition, {useSpeechRecognition} from 'react-speech-recognition';

const DashboardPage = () => {
    const commands = [
        {
            command: 'Where is (my) (the) *',
            callback: (item) => setMessage(`${item} is located in the Red Tool Box (A1), and Black Storage Cabinet (Top Drawer).`),
        },
        {
            command: 'Where\'s (my) (the) *',
            callback: (item) => setMessage(`${item} is located in the Red Tool Box (A1), and Black Storage Cabinet (Top Drawer).`),
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
            callback: ({resetTranscript}) => clearButtonClick(),
        },
    ];

    const {transcript, resetTranscript} = useSpeechRecognition({commands});
    const [isListening, updateIsListening] = useState(false);
    const [message, setMessage] = useState('');

    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
        return null;
    }

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

    return (
        <div className="site-card-wrapper">
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
            <Card>
                {message}
            </Card>
        </div>

    );
};

export default DashboardPage;
