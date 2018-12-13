import * as React from 'react';
import { Button, Layout } from 'antd';
import './errorContent.less';

const { Content } = Layout;

export const ErrorContent: React.StatelessComponent<{ onReload: () => void }> = ({ onReload }) => {

    return (
        <Layout className="error-content-layout center">
            <Content className="content">
                <div className="flex flex-col flex-center-h centering">
                    <div className="oracle-icon oracle-icon-error margin3">
                        <h1 className="margin3 basic800">Some error title</h1>
                        <div>Check internet connection or node address in keeper</div>
                        <Button onClick={onReload} type="primary" size="large" icon="reload" className="ant-btn ant-btn-primary ant-btn-lg">
                            Try again
                        </Button>
                    </div>
                </div>
            </Content>
        </Layout>
    );
};
