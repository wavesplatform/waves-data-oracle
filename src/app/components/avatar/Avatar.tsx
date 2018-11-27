import * as React from 'react';
import { Avatar as AntAvatar } from 'antd';

// @ts-ignore
import * as avatar from 'identity-img';


const SIZE = 67;

export class Avatar extends React.PureComponent<IProps> {

    state: IState = {};
    
    static getDerivedStateFromProps(nextProps: IProps, prevState: IState) {
        const { address, size = SIZE } = nextProps;

        if (prevState.address !== address) {
            avatar.config({ rows: 8, cells: 8 });
            const src = address ? avatar.create(address, { size: size * 3 }) : '';
            return { address, src };
        }

        return {};
    }

    render() {
        const { size = SIZE, className, onClick } = this.props;
    
        return <div className={className} onClick={onClick}>
            <AntAvatar
                size={size}
                src={this.state.src}>
            </AntAvatar>
        </div>;
    }

}


interface IProps {
    size?: number;
    address: string;
    className?: string;
    onClick?: (ev: any) => void;
}

interface IState {
    address?: string;
    src?: string;
}
