import * as React from 'react';
import { Button, Layout } from 'antd';

const { Content } = Layout;

export const ErrorContent: React.StatelessComponent<{ onReload: () => void }> = ({ onReload }) => {
    
    return (
        <Layout>
            <Content>
                <div>Network error</div>
                <div>Check internet connection or node address in keeper</div>
                <Button onClick={onReload} type="primary" size="large" icon="reload">
                    Try again!
                </Button>
            </Content>
        </Layout>
    );
};

