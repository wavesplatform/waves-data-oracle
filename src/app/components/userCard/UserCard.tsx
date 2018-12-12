import * as React from 'react';
import { Avatar } from '../avatar';
import './userCard.less';


export class UserCard extends React.PureComponent<IProps, IState> {
    
    readonly state = Object.create(null);
    
    render() {
        return <div className="user-card center">
            <Avatar address={this.state.address} size={50} className="user-card_avatar margin2"/>
            <h3 className="user-card_name">{this.state.name}</h3>
            <div className="user-card_address">{this.state.address}</div>
        </div>;
    }
    
    static getDerivedStateFromProps(nextProps: IProps) {
        return { address: nextProps.address, name: nextProps.name };
    }
}

interface IProps {
    address?: string;
    name?: string;
}

interface IState {
    address: string;
    name: string;
}
