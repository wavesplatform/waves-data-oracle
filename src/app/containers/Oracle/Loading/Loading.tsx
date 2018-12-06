import * as React from 'react';
import { Spin } from 'antd';


export const Loading: React.StatelessComponent<IProps> = ({ tip, size }) => {
    
    return <div>
        <Spin size={size} tip={tip}/>
    </div>
};

interface IProps {
    tip?: string;
    size?: "default" | "small" | "large";
}
