import * as React from 'react';
import { Layout, List } from 'antd';
import './rightSider.less';
import cn from 'classnames';

const { Sider } = Layout;


export const RightSider: React.StatelessComponent<IProps> = ({ data, width = 450 }) => {
    
    return (
        <Sider className="right-info"
               theme='light'
               width={width}>
  
                <List dataSource={data}
                      bordered={false}
                      renderItem={(item: any) => <InfoItem {...item}/>}
                />
        </Sider>
    );
};

const InfoItem: React.StatelessComponent<IItem> = ({ title, description, className }) => {
    
    const itemClassName = cn('right-info_conteiner', className);
    return (
        <List.Item style={{ borderBottom: 'none' }}>
            <div className={itemClassName}>
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

interface IItem {
    title: string;
    description: string;
    className?: string;
}

interface IProps {
    data: Array<IItem>;
    width?: number;
}
