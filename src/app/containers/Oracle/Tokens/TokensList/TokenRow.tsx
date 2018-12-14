import * as React from 'react';
import { Row, Col, Avatar } from 'antd';
import { TokenModel } from 'app/models';

export namespace TokensRow {
    export interface Props {
        token: TokenModel;
        onSelect: (tokenId: string) => void;
    }
}

const TokensRow: React.StatelessComponent<TokensRow.Props> = (props) => {

    const onSelect = () => props.onSelect(props.token.content.id);
    const { id, status, name, site, logo, ticker, description } = props.token.content;
    return (
        <Row onClick={onSelect} justify="space-between" type="flex" align="middle" className="token-list__row body2">
            <Col span={1}>
                <Avatar className="token-list_avatar" src={logo || ''} icon="picture" size={40}/>
            </Col>
            <Col span={6}>
                <div>{name}</div>
                <div className="basic400 footnote2 word-break">{id}</div>
            </Col>
            <Col span={2}>
                <div>{ticker}</div>
            </Col>
            <Col span={3}>
                <div>{status}</div>
            </Col>
            <Col span={4}>
                <div className="submit400 word-break">{site}</div>
            </Col>
            <Col span={6}>
                <div className="token-list__description-overflow">{description && description.en}</div>
            </Col>
        </Row>
    );
};

export default TokensRow;
