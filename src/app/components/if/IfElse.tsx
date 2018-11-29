import * as React from 'react';

interface Props {
    conditions?: any;
}

export const IfElse: React.StatelessComponent<Props> = (props) => {
    if (!props.conditions) {
        return <React.Fragment>{props.children}</React.Fragment>;
    }
    return null;
};
