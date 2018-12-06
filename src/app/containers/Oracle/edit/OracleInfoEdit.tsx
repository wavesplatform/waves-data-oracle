import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { RootState } from 'app/reducers';
import { Button, Layout } from 'antd';
import '../../../components/imageUpload/edit-form.less';
import { currentFee, getOracleInfoDataFields, IOracleInfo } from 'app/services/dataTransactionService';
import { UploadFile } from 'antd/lib/upload/interface';
import { FORM_FIELDS } from 'app/containers/Oracle/edit/oracleEditForm';
import { ORACLE_STATUS } from 'app/models';
import { Form } from 'app/components/form/Form';
import { equals } from 'ramda';


const ORACLE_INFO_KEYS = ['name', 'site', 'mail', 'logo', 'description'] as Array<keyof IOracleInfo>;

export namespace OracleInfo {
    
    export interface IProps {
        user: RootState.UserState;
        tokens: RootState.TokensState;
        actions: null;
        oracleInfo: RootState.OracleInfoState;
    }
    
    export interface IState {
        isValid: boolean;
        oracleInfo: Partial<IOracleInfo>;
        fileList: Array<Partial<UploadFile>>;
        lastPropsStatus?: ORACLE_STATUS;
        diff: Partial<IOracleInfo>;
    }
}

const { Content } = Layout;

@connect(
    (state: RootState): Pick<OracleInfo.IProps, 'user' & 'oracleInfo'> => {
        return { user: state.user, oracleInfo: state.oracleInfo };
    },
    (dispatch: Dispatch): Pick<OracleInfo.IProps, 'actions'> => ({
        actions: null
    })
)
export class OracleInfo extends React.Component<OracleInfo.IProps, OracleInfo.IState> {
    
    static defaultProps: Partial<OracleInfo.IProps> = {};
    
    state = {
        isValid: false,
        fileList: [],
        oracleInfo: Object.create(null),
        diff: Object.create(null)
    };
    
    render() {
        const disableSave = !Object.keys(this.state.diff).length || !this.state.isValid;
        
        return (
            <Layout>
                <Content>
                    <h1>Create an oracle</h1>
                    
                    <Form fields={FORM_FIELDS}
                          values={{ ...this.state.oracleInfo, address: this.props.user.address }}
                          readonly={{ address: true }}
                          onChange={this._onChangeForm}/>
                    
                    <Fee {...this.state}/>
                    
                    <Button type="primary">Cancel</Button>
                    <Button type="primary"
                            disabled={disableSave}>Save</Button>
                </Content>
            </Layout>
        );
    }
    
    private _onChangeForm = (data: Form.IChange<IOracleInfo & { address: string }>) => {
        this.setState({ oracleInfo: data.values, isValid: data.isValid });
    };
    
    static getDerivedStateFromProps(nextProps: OracleInfo.IProps, nextState: OracleInfo.IState) {
        
        if (!nextState.lastPropsStatus || nextProps.oracleInfo.status !== nextState.lastPropsStatus) {
            nextState.lastPropsStatus = nextProps.oracleInfo.status;
            ORACLE_INFO_KEYS.forEach(key => {
                nextState.oracleInfo[key] = nextProps.oracleInfo.content[key];
            });
            
            if (nextState.oracleInfo.logo) {
                nextState.fileList = [
                    {
                        uid: `t-${Date.now()}`,
                        thumbUrl: nextState.oracleInfo.logo
                    }
                ];
            }
        }
        
        ORACLE_INFO_KEYS.forEach(key => {
            if (equals(nextState.oracleInfo[key], nextProps.oracleInfo.content[key])) {
                delete nextState.diff[key];
            } else {
                nextState.diff[key] = nextState.oracleInfo[key];
            }
        });
        
        return nextState;
    }
}

const Fee: React.StatelessComponent<OracleInfo.IState> = params => {
    if (!params.isValid) {
        return <span>Fee 0 WAVES</span>;
    }
    
    const fields = getOracleInfoDataFields(params.diff);
    try {
        const fee = fields.length ? Number(currentFee(fields)) / Math.pow(10, 8) : 0;
        return <span>Fee {fee} WAVES</span>;
    } catch (e) {
        return <span>Fee 0 WAVES</span>;
    }
};
