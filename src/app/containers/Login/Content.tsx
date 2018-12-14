import * as React from 'react';
import { Button, Layout, Row } from 'antd';
import { AppModel } from 'app/models';

export const Content: React.StatelessComponent<{ onLogin: () => void, app: AppModel }> = (props) => {
    const { Header, Content: AntContent, Footer } = Layout;
    
    return  <Layout>
        <div className="wrapper flex">
            <div className="left-side"></div>
            <div className="right-side center">
                <Header className="header">
                    <div className="logo-black"></div>
                </Header>
                <AntContent className="content">
                    <Row>
                        <h1 className="margin2 basic800">Welcome to Waves Oracle</h1>
                        <div className="margin4 basic600 body1">Smart contracts live like in a walled garden,
                            they cannot fetch external data on their own.
                            Oracle is here to help. We act as a data carrier,
                            a reliable connection between Web APIsandyour Dapp.</div>
                    </Row>
                    <Row gutter={0}>
                        <Button onClick={props.onLogin} type="primary" size="large" icon="login">Login from Keeper</Button>
                    </Row>
                </AntContent>
                <Footer>
                    <div><a href="#" className="basic400 body2">Where am I?</a></div>
                </Footer>
            </div>
        </div>
    </Layout>;
};
