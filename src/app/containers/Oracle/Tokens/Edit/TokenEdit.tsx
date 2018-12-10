import { Button, Icon, Layout, Spin } from 'antd';
import { Form } from 'app/components/form/Form';
import { If } from 'app/components';
import * as React from 'react';
import { getTokenFormFields } from 'app/containers/Oracle/Tokens/Edit/tokenForm';
import { RootState } from 'app/reducers';
import { currentFee, getAssetFields, getAssetInfo, IAssetInfo } from 'app/services/dataTransactionService';
import { RouteComponentProps } from 'react-router';
import { find, pathEq } from 'ramda';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { getDiff, omit } from 'app/utils';
import { AssetsActions } from 'app/actions';
import { RightSider } from 'app/components/RightSide/RightSider';
import * as InfoData from './info.json';

const { Content } = Layout;

@connect(
    (state: RootState): Pick<TokenEdit.IProps, 'user' & 'tokens'> => {
        return { user: state.user, tokens: state.tokens };
    },
    (dispatch: Dispatch): Pick<TokenEdit.IProps, 'actions'> => ({ // TODO! Add tokens actions
        actions: bindActionCreators(omit({ ...AssetsActions }, 'Type'), dispatch)
    })
)
export class TokenEdit extends React.Component<TokenEdit.IProps, TokenEdit.IState> {
    
    state: TokenEdit.IState = {
        isValid: true,
        isNew: false,
        token: Object.create(null),
        diff: Object.create(null)
    };
    
    public render() {
        
        const spinning = false;
        const hasError = false;
        
        const { isValid, isNew } = this.state;
        
        return (
            <Layout style={{ backgroundColor: '#fff', height: '100%' }}>
                <Content style={{ margin: '20px', minWidth: '450px' }}>
                    <Spin style={{ height: '100%' }}
                          spinning={spinning}
                          indicator={<Icon type="loading" style={{ fontSize: 24 }} spin/>}>
                        <h1>Create an oracle</h1>
                        
                        <Form fields={getTokenFormFields(this.props.user.server)}
                              values={this.state.token}
                              readonly={{ name: true, id: !isNew }}
                              onChange={this._onChangeForm}/>
                        
                        <Fee {...this.state}/>
                        
                        <Button type="primary">Cancel</Button>
                        <Button type="primary"
                                onClick={this._saveTokenHandler}
                                disabled={!isValid}>Save</Button>
                        <If condition={hasError}>
                            <span>Error!</span>
                        </If>
                    </Spin>
                </Content>
                <RightSider data={InfoData}/>
            </Layout>
        );
    }
    
    private _onChangeForm = (data: Form.IChange<Partial<IAssetInfo>>) => {
        if (data.values.id && data.values.id !== this.state.token.id) {
            getAssetInfo(data.values.id, this.props.user.server).then(info => {
                const name = data.values.id ? info.name : '';
                this.setState({ token: { ...data.values, name } });
            }).catch(e => {
                const name = '';
                this.setState({ token: { ...data.values, name } });
            });
        } else {
            const name = data.values.id ? data.values.name : '';
            this.setState({ token: { ...data.values, name } });
        }
    };
    
    private _saveTokenHandler = () => {
        this.props.actions.setAsset(this.state.diff);
    };
    
    public static getDerivedStateFromProps(props: TokenEdit.IProps, state: TokenEdit.IState): TokenEdit.IState {
        const { assetId } = props.match.params;
        const isNew = assetId === 'create';
        
        const { content } = !isNew && find(pathEq(['content', 'id'], assetId), props.tokens.content) || Object.create(null);
        
        if (!isNew && !content) {
            throw new Error('Add 404 error!'); //TODO 404
        }
        
        const diff = getDiff(content || Object.create(null), state.token);
        
        return { ...state, diff, isNew, token: content };
    }
    
}

const Fee: React.StatelessComponent<TokenEdit.IState> = params => {
    if (!params.isValid) {
        return <span>Fee 0 WAVES</span>;
    }
    
    const fields = getAssetFields({ ...params.diff, id: params.token.id || '' });
    try {
        const fee = fields.length ? Number(currentFee(fields)) / Math.pow(10, 8) : 0;
        return <span>Fee {fee} WAVES</span>;
    } catch (e) {
        return <span>Fee 0 WAVES</span>;
    }
};


export namespace TokenEdit {
    
    export interface IProps extends RouteComponentProps<{ assetId: string }> {
        tokens: RootState.TokensState;
        user: RootState.UserState;
        actions: AssetsActions;
    }
    
    export interface IState {
        isNew: boolean;
        isValid: boolean;
        token: Partial<IAssetInfo>;
        diff: Partial<IAssetInfo>;
    }
}
