import * as React from 'react';
import { Layout, List } from 'antd';
import * as pageData from './info.json';
const { Sider } = Layout;



export const RightSider: React.StatelessComponent = (props) => {

    return (
        <Sider theme='light'
               width={450}>
            <List dataSource={pageData}
                  bordered={false}
                  renderItem={(item: any ) => <InfoItem {...item}/>}
            />
        </Sider>
    );
};

const InfoItem: React.StatelessComponent<{ title: string, description: string }> = ({ title, description }) => {
    return (
        <List.Item style={{ borderBottom: 'none' }}>
            <div>
                <h1>{title}</h1>
            </div>
            <div>
                {description}
            </div>
        </List.Item>
    );
};
