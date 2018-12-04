import * as React from 'react';
import { Spin } from 'antd';
import { ORACLE_STATUS } from 'app/models';
import { Redirect } from 'react-router';


export const Loading: React.StatelessComponent<IProps> = ({ tip, size, status }) => {
    
    switch (status) {
        case ORACLE_STATUS.EMPTY:
            return <Redirect to={'/oracle/empty'}/>;
        case ORACLE_STATUS.HAS_ERROR:
            return <Redirect to={'/oracle/create'}/>;
        case ORACLE_STATUS.READY:
            return <Redirect to={'/oracle/edit'}/>;
        case ORACLE_STATUS.SERVER_ERROR:
            return <Redirect to={'/oracle/error'}/>;
    }
    
    return <div>
        <Spin size={size} tip={tip}/>
    </div>
};

interface IProps {
    tip?: string;
    size?: "default" | "small" | "large";
    status: ORACLE_STATUS;
}
