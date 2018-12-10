import * as React from 'react';
import { Layout, List } from 'antd';
import './infoEdit.less';
import * as pageData from './info.json';

const { Sider } = Layout;


export const RightSider: React.StatelessComponent = () => {
    
    return (
        <Sider theme='light'
               width={450}>
            <Layout style={{height: "100%"}}>
                <List dataSource={pageData}
                      bordered={false}
                      renderItem={(item: any) => <InfoItem {...item}/>}
                />
            </Layout>
        </Sider>
    );
};

const InfoItem: React.StatelessComponent<{ title: string, description: string }> = ({ title, description }) => {
    return (
        <List.Item style={{ borderBottom: 'none' }}>
            <div className='right-info_conteiner'>
                <div>
                    <h2>{title}</h2>
                </div>
                <div>
                    {description}
                </div>
            </div>
        </List.Item>
    );
};
