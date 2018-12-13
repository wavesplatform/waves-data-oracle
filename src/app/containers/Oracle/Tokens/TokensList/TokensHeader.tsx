import * as React from 'react';
import { Row, Col, Icon } from 'antd';

export namespace TokensHeader {
    export interface Props {
        onSort: (options: TokensHeader.State) => void;
    }
    
    export interface State {
        sortField: string | null;
        sortOptions: "asc" | "desc";
    }
}


class TokensHeader extends React.PureComponent<TokensHeader.Props, TokensHeader.State> {
    
    readonly state = {
        sortField: null,
        sortOptions: TokensHeader.SORT.ASC,
    };
    
    static SORT = {
        ASC: "asc" as "asc",
        DESC: "desc" as "desc",
    };
    
    changeSortHandler = (sortField: string) => {
        if (this.state.sortField !== sortField) {
            const state = {
                sortField,
                sortOptions: TokensHeader.SORT.ASC,
            };
            this.setState(state);
            
            this.props.onSort(state);
            return;
        }
        
        const sortOptions = this.state.sortOptions === TokensHeader.SORT.ASC ?
            TokensHeader.SORT.DESC :
            TokensHeader.SORT.ASC;
        
        const state = {
            sortField,
            sortOptions,
        };
        
        this.setState({ sortOptions });
        this.props.onSort(state);
    };
    
    render() {
        return (
            <Row justify="space-between" type="flex" align="middle" className="token-list__list-header margin1 basic400">
                <Col span={1}>
                    <div className="tokens-list__avatar"/>
                </Col>
                <Col span={6}>
                    <HeaderItem name="name"
                                title="Name"
                                sort={this.state}
                                onClick={this.changeSortHandler} />
                </Col>
                <Col span={2}>
                    <HeaderItem name="ticker"
                                title="Ticker"
                                sort={this.state}
                                onClick={this.changeSortHandler} />
                </Col>
                <Col span={3}>
                    <HeaderItem name="status"
                                title="Status"
                                sort={this.state}
                                onClick={this.changeSortHandler} />
                </Col>
                <Col span={4}>
                    <HeaderItem name="site"
                                title="Site"
                                sort={this.state}
                                onClick={this.changeSortHandler} />
                </Col>
                <Col span={6}>
                    <HeaderItem name="description"
                                title="Description"
                                sort={this.state}
                                onClick={this.changeSortHandler} />
                </Col>
            </Row>
        );
    }
}

interface IHeaderItemProps {
    title: string;
    name: string;
    onClick: (fieldName: string) => void;
    sort: {
        sortField: string|null;
        sortOptions: "asc" | "desc";
    };
}

const HeaderItem: React.StatelessComponent<IHeaderItemProps> = ({ title, onClick, name, sort }) => {
        
        const isActive = sort.sortField === name;
        const icon = sort.sortOptions ===  TokensHeader.SORT.DESC ? 'up' : 'down';
        return <div onClick={onClick.bind(null, name)}>
            {title} {isActive ? <Icon type={icon} style={{fontSize: "10px"}}/> : null}
        </div>
};

export default TokensHeader;
