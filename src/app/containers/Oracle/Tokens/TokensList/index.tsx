import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { RootState } from 'app/reducers';
import { OracleTokensActions } from 'app/actions';
import TokenRow from './TokenRow';
import TokenHeader from './TokensHeader';
import { Row, List } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { omit } from 'app/utils';
import { TokenModel } from 'app/models';

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
    (state: RootState): Pick<TokensList.Props, 'tokens'> => {
        return { tokens: state.tokens };
    },
    (dispatch: Dispatch): Pick<TokensList.Props, 'actions'> => ({
        actions: bindActionCreators(omit({ ...OracleTokensActions }, 'Type'), dispatch)
    })
)
class TokensList extends React.PureComponent<TokensList.Props, TokensList.State> {
    
    readonly state = {
        sortField: null,
        sortOptions: 'asc' as 'asc'
    };
    
    editHandler = (tokenId: string) => {
        this.props.history.push(`${this.props.history.location.pathname}/${tokenId}`);
    };
    
    sortHandler = ({ sortField, sortOptions }: TokensList.State) => {
        this.setState({ sortField, sortOptions })
    };
    
    render(): React.ReactNode {
        //const { tokens } = this.props;
        const field = this.state.sortField;
        const tokens = {
            content: [
                {
                    content: {
                        id: 'asd21312313x23d1231d23123123d',
                        status: 1,
                        logo: null,
                        site: 'www.mama-mia.ru',
                        ticker: 'myTestToken',
                        email: null,
                        description: null
                    }
                },{
                    content: {
                        id: 'wert34v34vw34tw34vt3wvt3w4tvw34',
                        status: 3,
                        logo: null,
                        site: null,
                        ticker: 'my2',
                        email: null,
                        description: null
                    }
                },{
                    content: {
                        id: 'ereffreavwerfwergwergewrgwergweg',
                        status: 2,
                        logo: null,
                        site: 'www.kto.tam',
                        ticker: 'myTestToken3',
                        email: 'graf@waves',
                        description: null
                    }
                },{
                    content: {
                        id: '',
                        status: 3,
                        logo: null,
                        site: 'wavesplatform.com',
                        ticker: 'WAVES',
                        email: null,
                        description: 'Official Waves Money'
                    }
                },
            ]
        };
        const data = field ? [...tokens.content].sort((token1, token2) => token1[field] >= token2[field] ? 1 : -1);
        return <div>
            <Row>Header</Row>
            <TokenHeader onSort={this.sortHandler as any}/>
            <List className=""
                  itemLayout="horizontal"
                  dataSource={data}
                  renderItem={(token: TokenModel) => (
                      <TokenRow token={token} onSelect={this.editHandler}/>
                  )}
            />
        </div>;
    }
    
    static sorter(field: string) {
        return (token1: TokenModel, token2:TokenModel): number => {
            const value1 = token1.content[field];
            const value2 = token2.content[field];
            
        }
    }
}

export default TokensList;


export namespace TokensList {
    export interface Props extends RouteComponentProps<void> {
        tokens: RootState.TokensState;
        actions: OracleTokensActions;
        app: RootState.AppState;
    }
}
