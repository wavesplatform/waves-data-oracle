import * as React from 'react';
import { Spin, Layout } from 'antd';

const { Content } = Layout;

export const Loading: React.StatelessComponent<IProps> = ({ tip, size, ...props }) => {
    
    return <Layout {...props}>
        <Content>
            <Spin size={size} tip={tip}/>
        </Content>
    </Layout>;
};

interface IProps {
    tip?: string;
    size?: 'default' | 'small' | 'large';
}
