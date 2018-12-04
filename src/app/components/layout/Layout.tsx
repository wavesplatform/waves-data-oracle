import * as React from 'react';
import { Layout } from 'antd';
import { If } from 'app/components';
import './layout.less';

const { Header, Sider, Content, Footer } = Layout;

export default class LayoutComponent extends React.PureComponent<IProps> {
    
    render(): React.ReactNode {
        
        const { rightSider, leftSider, header, content, footer } = this.props;
        
        return <Layout className="oracle-layout">
            <If condition={leftSider}>
                <Sider width={370} className="oracle-layout_sider-left">{leftSider}</Sider>
            </If>
            <Layout>
                <If condition={header}>
                    <Header style={{background: '#fff'}}>{header}</Header>
                </If>
                
                <If condition={content}>
                    <Content>{content}</Content>
                </If>
                
                <If condition={footer}>
                    <Footer>{footer}</Footer>
                </If>
            </Layout>
            <If condition={rightSider}>
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
