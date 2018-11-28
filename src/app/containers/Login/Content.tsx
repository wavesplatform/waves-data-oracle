import * as React from 'react';
import { Row, Col, Button, notification } from 'antd';
import { AppModel } from 'app/models';
import * as content from './content.json';


const Description: React.StatelessComponent<any> = ({ messageConf }) => {
    return (
        <div>
            <Row>
                <Col>
                    <div>{messageConf.actionText}</div>
                    {messageConf.help ? <div>
                        <a href={messageConf.help} target='_blank'>more info</a>
                    </div> : null}
                </Col>
            </Row>
        </div>
    );
};


export const Content: React.StatelessComponent<{ onLogin: () => void, app: AppModel }> = (props) => {
    
    const { kepperError } = props.app;
    
    if (kepperError) {
        const messageConf = (content as any).errors[kepperError.code];
        const notifyData = <Description messageConf={messageConf}/>;
        notification.error({
            message: messageConf.message,
            description: notifyData,
            key: kepperError.code.toString(10),
        });
    }
    
    return <div>
        <Row gutter={0}>
            <Col span={24}><h1>LOGIN By KEEPER</h1></Col>
        </Row>
        <Row gutter={0}>
            <Col span={24}>
                <Button onClick={props.onLogin} type="primary" size="large" icon="login">Login</Button>
            </Col>
        </Row>
    </div>;
};
