import * as React from 'react';
import { Button, Layout, Row } from 'antd';
import { AppModel } from 'app/models';

export const Content: React.StatelessComponent<{ onLogin: () => void, app: AppModel }> = (props) => {
    const { Header, Content: AntContent, Footer } = Layout;
    
    return  <Layout >
        <Header className="header">
            <div>Oracle</div>
        </Header>
        <AntContent className="content">
            <Row gutter={0}>
                Logo
            </Row>
            <Row>
                <div>Welcome to Oracle</div>
                <div>You can create your cripto world</div>
            </Row>
            <Row gutter={0}>
                <Button onClick={props.onLogin} type="primary" size="large" icon="login">Login</Button>
            </Row>
        </AntContent>
        <Footer>
            <div>about oracle</div>
        </Footer>
    </Layout>;
};
