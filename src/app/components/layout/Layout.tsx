import * as React from 'react';
import { Layout } from 'antd';
const { Header, Sider, Content } = Layout;

export default class LayoutComponent extends React.PureComponent {
  
  public readonly state = { collapsed: true };
  public props: IProps = {};
  
  public render(): React.ReactNode {
    return (
      <Layout hasSider={true} style={{ minHeight: '100vh' }}>
        <Sider
          theme={this.props.theme}
          trigger={true}
          collapsible={true}
          collapsed={this.props.menuCollapsed}>
          {this.props.menu}
        </Sider>
        <Layout>
          {this.props.header ? <Header style={{ background: '#fff', padding: 0 }}>
            {this.props.header}
          </Header>: null}
          <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: 280 }}>
            {this.props.content}
          </Content>
        </Layout>
        <Sider
          theme={this.props.theme}
          style={{position: 'absolute', right: 0, top: 0, height: '100%'}}
          width={'80%'}
          collapsedWidth={0}
          trigger={true}
          collapsible={true}
          reverseArrow={true}
          collapsed={this.props.optionsCollapsed}>
          {this.props.options}
        </Sider>
      </Layout>);
  }
}

interface IProps {
  menu?: React.ReactNode;
  menuCollapsed?: boolean;
  showMenu?: boolean;
  options?: React.ReactNode;
  optionsCollapsed?: boolean;
  showOptions?: boolean;
  content?: React.ReactNode;
  header?: React.ReactNode;
  showHeader?: boolean;
  theme?: 'light'|'dark';
  
}
