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
    
    const itemClassName = cn('right-info_container', className);
    return (
        <List.Item>
            <div className={itemClassName}>
                <h2 className='margin1 basic800'>{title}</h2>
                <div className='margin2 basic600'>{description}</div>
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
