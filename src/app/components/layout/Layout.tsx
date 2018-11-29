import * as React from 'react';
import { Layout } from 'antd';
import { If } from 'app/components';
import './layout.less';

const { Header, Sider, Content, Footer } = Layout;

export default class LayoutComponent extends React.PureComponent {
    
    readonly props: IProps = Object.create(null);
    
    render(): React.ReactNode {
        
        const { rightSider, leftSider, header, content, footer } = this.props;
        
        return <Layout>
            <If conditions={leftSider}>
                <Sider>{leftSider}</Sider>
            </If>
            <Layout>
                <If conditions={header}>
                    <Header style={{background: '#fff'}}>{header}</Header>
                </If>
                
                <If conditions={content}>
                    <Content>{content}</Content>
                </If>
                
                <If conditions={footer}>
                    <Footer>{footer}</Footer>
                </If>
            </Layout>
            <If conditions={rightSider}>
                <Sider>{rightSider}</Sider>
            </If>
        </Layout>;
    }
}

interface IProps {
    rightSider?: React.ReactNode;
    header?: React.ReactNode;
    content?: React.ReactNode;
    footer?: React.ReactNode;
    leftSider?: React.ReactNode;
}
