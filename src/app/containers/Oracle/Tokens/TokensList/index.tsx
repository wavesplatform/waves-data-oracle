import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import { RootState } from 'app/reducers';
import { OracleTokensActions } from 'app/actions';
import TokenRow from './TokenRow';
import { Row } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { omit } from 'app/utils';
import { TokensModel, TokenModel } from 'app/models';

export namespace TokensList {
    export interface Props extends RouteComponentProps<void> {
        tokens: RootState.TokensState;
    }
}

interface ITokensProps {
    tokens: TokensModel;
    onEdit: (tokenId: string) => void;
}

const Tokens: React.StatelessComponent<ITokensProps> = ({ tokens, onEdit }) => {
    const { content } = tokens;
    const getProps = (token: TokenModel) => ({
        onSelect: onEdit,
        token,
        key: token.content.id
    });
    return (
        <React.Fragment>
            {content.map(token => <TokenRow {...getProps(token)}/>)}
        </React.Fragment>
    );
};

@connect(
    (state: RootState): Pick<TokensList.Props, 'tokens'> => {
        return { tokens: state.tokens };
    },
    (dispatch: Dispatch): Pick<TokensList.Props, 'actions'> => ({
        actions: bindActionCreators(omit({ ...OracleTokensActions }, 'Type'), dispatch)
    })
)
class TokensList extends React.PureComponent<TokensList.Props> {
    
    editHandler = (tokenId: string) => {
        this.props.history.push(`${this.props.history.location.pathname}/${tokenId}`);
    };
    
    render(): React.ReactNode {
        //const { tokens } = this.props;
        
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
        
        return <div>
            <Row>Header</Row>
            <Row>Table info</Row>
            <Tokens onEdit={this.editHandler} tokens={tokens as any}/>
        </div>;
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
