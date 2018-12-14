import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { RootState } from 'app/reducers';
import { OracleTokensActions } from 'app/actions';
import TokenRow from './TokenRow';
import TokenHeader from './TokensHeader';
import { Row, List, Button, Col } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { omit } from 'app/utils';
import { TokenModel } from 'app/models';
import { IAssetInfo } from 'app/services/dataTransactionService';
import FirstToken from 'app/containers/Oracle/Tokens/FirstToken';
import './tokenList.less';

export namespace TokensList {
    export interface Props extends RouteComponentProps<void> {
        tokens: RootState.TokensState;
    }
    
    export interface State {
        sortField: string | null;
        sortOptions: "asc" | "desc";
    }
}

@connect(
    (state: RootState): Pick<TokensList.IProps, 'tokens'> => {
        return { tokens: state.tokens };
    },
    (dispatch: Dispatch): Pick<TokensList.IProps, 'actions'> => ({
        actions: bindActionCreators(omit({ ...OracleTokensActions }, 'Type'), dispatch)
    })
)
class TokensList extends React.PureComponent<TokensList.IProps, TokensList.State> {
    
    readonly state = {
        sortField: null,
        sortOptions: 'asc' as 'asc'
    };
    
    editHandler = (tokenId: string = 'create') => {
        this.props.history.push(`/oracle/tokens/${tokenId}`);
    };
    
    sortHandler = ({ sortField, sortOptions }: TokensList.State) => {
        this.setState({ sortField, sortOptions })
    };
    
    render(): React.ReactNode {
        const { tokens } = this.props;
        const field = this.state.sortField;
        const sort = this.state.sortOptions;
        const data = [...tokens.content];
        if (field && sort) {
            data.sort(TokensList.sorter(field, sort) as any);
        }
        
        if (!data.length) {
            return <FirstToken/>;
        }
        
        return <div className="token-list padding-layout">
            <Row className="token-list__header margin2">
                <Col span={12}>
                    <h2>Token verification</h2>
                    <div className="basic400">Total 1 entries</div>
                </Col>
                <Col span={12} className="right">
                    <Button type="primary" onClick={() => this.editHandler()}>Add Token</Button>
                </Col>
            </Row>
            <div className="token-list__scroller">
                <TokenHeader onSort={this.sortHandler as any}/>
                <List className="token-list__container border-radius"
                      itemLayout="horizontal"
                      dataSource={data}
                      renderItem={(token: TokenModel) => (
                          <TokenRow token={token} onSelect={this.editHandler}/>
                      )}
                />
            </div>
        </div>;
    }
    
    static sorter(field: keyof IAssetInfo, sortAs: "asc" | "desc") {
        const more = sortAs === "asc" ? 1 : -1;
        const less = 0 - more;
        return (token1: TokenModel, token2:TokenModel): number => {
            const value1 = (token1.content[field]);
            const value2 = (token2.content[field]);
            
            if (value1 === value2) {
                return 0;
            }
            
            if (value1 == null) {
                return less;
            }
    
            if (value2 == null) {
                return more;
            }
            
            if (value1 > value2) {
                return more;
            }
            
            return less;
        }
    }
}

export default TokensList;


export namespace TokensList {
    export interface IProps extends RouteComponentProps<void> {
        tokens: RootState.TokensState;
        actions: OracleTokensActions;
        app: RootState.AppState;
    }
}
