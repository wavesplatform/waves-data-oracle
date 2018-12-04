import * as React from 'react';
import { Button } from 'antd';


export const ErrorContent: React.StatelessComponent<{ onReload: () => void }> = ({ onReload }) => {
    
    return (
        <div>
            <div>Network error</div>
            <div>Check internet connection or node address in keeper</div>
            <Button onClick={onReload} type="primary" size="large" icon="reload">
                Try again!
            </Button>
        </div>
    );
};

