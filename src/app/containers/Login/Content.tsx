import * as React from 'react';
import { Row, Col, Button } from 'antd';


export const Content: React.StatelessComponent<{ onLogin: () => void }> = (props) => {
  return <div>
    <Row gutter={0}>
      <Col span={24}><h1>LOGIN By KEEPER</h1></Col>
    </Row>
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
