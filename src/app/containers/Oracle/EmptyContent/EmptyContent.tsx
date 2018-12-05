import * as React from 'react';
import { Button } from 'antd';


export const EmptyContent: React.StatelessComponent<{ toCreate: () => void}> = ({ toCreate }) => {
    
    return (
        <div>
            <div>Data about your Oracle was not found in the library</div>
            <Button onClick={toCreate} type="primary" size="large" icon="reload">
                Create oracle!
            </Button>
        </div>
    );
};

