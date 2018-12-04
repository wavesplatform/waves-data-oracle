import * as React from 'react';
import { ORACLE_STATUS } from 'app/models';


export const OracleTitle: React.StatelessComponent<Props> = ({ status }) => {
    
    switch (status) {
        case ORACLE_STATUS.SERVER_ERROR:
            return <div>SERVER ERROR</div>;
        case ORACLE_STATUS.HAS_ERROR:
        case ORACLE_STATUS.READY:
            return <div>Edit Oracle Info</div>;
        case ORACLE_STATUS.EMPTY:
            return <div>Create Oracle Info</div>;
        case ORACLE_STATUS.LOADING:
            return null;
    }
};

interface Props {
    status: ORACLE_STATUS;
}
