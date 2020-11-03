import React, {useState} from 'react';
import { Card, Col, Row, Button } from 'antd';
import { PlayCircleOutlined, CloseOutlined, PauseCircleOutlined } from '@ant-design/icons';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'


function DashboardPage() {
    const { transcript, resetTranscript } = useSpeechRecognition();
    const [ isListening, updateIsListening ] = useState(false);

    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
        return null;
    }

    const VoiceControlClick = () => {
        updateIsListening(!isListening);

        if (!isListening) {
            SpeechRecognition.startListening({ continuous: true });
        } else {
            SpeechRecognition.stopListening()
        }
    }

  return (
    <div className="site-card-wrapper">
    <Card title="Voice Control" bordered={false}>
    <div style={{textAlign: "center", verticalAlign: "middle"}}>
        <Button onClick={VoiceControlClick} type={isListening ? "danger" : "primary"} icon={isListening ? <PauseCircleOutlined /> : <PlayCircleOutlined />}>
            {isListening ? "Stop" : "Start"}
        </Button>
        <Button onClick={resetTranscript} className={"buttonLeftMargin"} icon={<CloseOutlined />}>
            Clear
        </Button>
    </div>
    <br/>
        {transcript}
    </Card>
    <br/>
    <Row gutter={16}>
      <Col span={8}>
        <Card title="Items low on quantity" bordered={false}>
        content
        </Card>
      </Col>
      <Col span={8}>
        <Card title="Most used items" bordered={false}>
           content
        </Card>
      </Col>
      <Col span={8}>
        <Card title="Most infrequently used items" bordered={false}>
            content
        </Card>
      </Col>
    </Row>
  </div>

  );
}

export default DashboardPage;