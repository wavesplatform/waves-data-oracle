import * as React from 'react';
import { Layout } from 'antd';
import { If } from 'app/components';
import './layout.less';

const { Sider } = Layout;

export default class LayoutComponent extends React.PureComponent<IProps> {
    
    render(): React.ReactNode {
        
        const { leftSider, children } = this.props;
        
        return <Layout className="oracle-layout" style={{height: "100%"}}>
            <If condition={leftSider}>
                <Sider width={310} className="oracle-layout_sider-left">{leftSider}</Sider>
            </If>
            
            {children}
        </Layout>;
    }
}

interface IProps {
    rightSider?: React.ReactNode;
    header?: React.ReactNode;
    footer?: React.ReactNode;
    leftSider?: React.ReactNode;
}
