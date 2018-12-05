import * as React from 'react';
import { Row, Col, Icon } from 'antd';
import { TokenModel } from 'app/models';

export namespace TokensRow {
    export interface Props {
        token: TokenModel;
        onSelect: (tokenId: string) => void;
    }
}




const TokensRow: React.StatelessComponent<TokensRow.Props> = (props) => {
    
    const onSelect = () => props.onSelect(props.token.content.id);
    const { id, status, name, site, ticker, description } = props.token.content;
    return <Row onClick={onSelect} gutter={5}>
        <Col span={4}>
            <Icon/>
        </Col>
        <Col span={4}>
            <div>{name}</div>
            <div>{id}</div>
        </Col>
        <Col span={4}>
            <div>{ticker}</div>
        </Col>
        <Col span={4}>
            <div>{status}</div>
        </Col>
        <Col span={4}>
            <div>{site}</div>
        </Col>
        <Col span={4}>
            <div>{description}</div>
        </Col>
    </Row>
};

export default TokensRow;
