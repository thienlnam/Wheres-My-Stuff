import React, {useState} from 'react';
import {Card, Button} from 'antd';
import _ from 'lodash';
import {PlayCircleOutlined, CloseOutlined, PauseCircleOutlined} from '@ant-design/icons';
import SpeechRecognition, {useSpeechRecognition} from 'react-speech-recognition';
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
            setMessage(`Found ${item}!`);
            const result = await API.getParts(item);
            if (!result) {
                setMessage(`Sorry, I wasn't able to find any instances of `);
            } else {
                // Group the items by name
                let message = '';
                console.log(result);
                const grouped = _.groupBy(result, 'partName');
                console.log('GROUPED:', grouped);

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
                        message += `${detail.quantity} in the ${containerName} ${containerLocation ? ` located in the ${containerLocation}.` : '.'}\n`;
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
            <Card style={{whiteSpace: 'pre-wrap'}}>
                {message}
            </Card>
        </div>

    );
};

export default DashboardPage;
