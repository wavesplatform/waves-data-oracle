import * as React from 'react';

interface Props {
    condition?: any;
}

export const If: React.StatelessComponent<Props> = (props) => {
    if (!!props.condition) {
        return <React.Fragment>{props.children}</React.Fragment>;
    }
    return null;
};
