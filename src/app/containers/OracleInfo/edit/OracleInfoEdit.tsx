import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { RootState } from 'app/reducers';
import { Button } from 'antd';
import './edit-form.less';
import { currentFee, getOracleInfoDataFields, IOracleInfo } from 'app/services/dataTransactionService';
import { UploadFile } from 'antd/lib/upload/interface';
import { FORM_FIELDS } from 'app/containers/OracleInfo/edit/oracleEditForm';
import { ORACLE_STATUS } from 'app/models';
import { Input, Logo } from 'app/components';
import { Form } from 'app/components/form/Form';
import { equals } from 'ramda';


const ORACLE_INFO_KEYS = ['name', 'site', 'mail', 'logo', 'description'] as Array<keyof IOracleInfo>;

export namespace OracleInfo {
    export interface Props {
        user: RootState.UserState;
        assets: RootState.AssetsState;
        actions: null;
        oracleInfo: RootState.OracleInfoState;
    }
}

@connect(
    (state: RootState): Pick<OracleInfo.Props, 'user' & 'oracleInfo'> => {
        return { user: state.user, oracleInfo: state.oracleInfo };
    },
    (dispatch: Dispatch): Pick<OracleInfo.Props, 'actions'> => ({
        actions: null
    })
)
export class OracleInfo extends React.Component<OracleInfo.Props, TState> {

    static defaultProps: Partial<OracleInfo.Props> = {};

    state = {
        fileList: [],
        oracleInfo: Object.create(null),
        diff: Object.create(null),
        errors: Object.create(null)
    };

    handleChange = ({ fileList }: { fileList: Array<UploadFile> }) => {
        if (!fileList.length) {
            const oracleInfo = { ...this.state.oracleInfo, logo: '' };
            this.setState({ fileList, oracleInfo });
            return null;
        }
        const reader = new FileReader();
        reader.onload = () => {
            const logo = reader.result;
            const oracleInfo = { ...this.state.oracleInfo, logo };
            this.setState({ oracleInfo });
        };
        reader.readAsDataURL(fileList[0].originFileObj as File);
        this.setState({ fileList });
    };

    onChangeForm = (values: Partial<IOracleInfo>) => {
        this.setState({ oracleInfo: values });
    };

    render() {

        return (
            <div>
                <h1>Create an oracle</h1>

                <Logo value={this.state.oracleInfo.logo}
                      validate={Logo.validators.size(20)}
                      onChange={this._onChangeLogo}/>

                <div className={'row'}>
                    <span>Address</span>
                    <Input readOnly={true} value={this.props.user.address}/>
                </div>

                <Form fields={FORM_FIELDS}
                      values={this.state.oracleInfo}
                      onChange={this.onChangeForm}/>

                <Fee {...this.state}/>

                <Button type="primary">Cancel</Button>
                <Button type="primary" disabled={!Object.keys(this.state.diff).length}>Save</Button>
            </div>
        );
    }

    private _onChangeLogo = (logo: string | null) => {
        this.setState({ oracleInfo: { ...this.state.oracleInfo, logo } });
    };

    static getDerivedStateFromProps(nextProps: OracleInfo.Props, nextState: TState) {

        if (!nextState.lastPropsStatus || nextProps.oracleInfo.status !== nextState.lastPropsStatus) {
            nextState.lastPropsStatus = nextProps.oracleInfo.status;
            ORACLE_INFO_KEYS.forEach(key => {
                nextState.oracleInfo[key] = nextProps.oracleInfo[key];
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
            if (equals(nextState.oracleInfo[key], nextProps.oracleInfo[key])) {
                delete nextState.diff[key];
            } else {
                nextState.diff[key] = nextState.oracleInfo[key];
            }
        });

        return nextState;
    }
}

const Fee: React.StatelessComponent<TState> = params => {
    const fields = getOracleInfoDataFields(params.diff);
    const fee = fields.length ? Number(currentFee(fields)) / Math.pow(10, 8) : 0;
    return <span>Fee {fee}</span>;
};

type TState = {
    oracleInfo: Partial<IOracleInfo>;
    fileList: Array<Partial<UploadFile>>;
    lastPropsStatus?: ORACLE_STATUS;
    diff: Partial<IOracleInfo>;
    errors: { [key in keyof IOracleInfo]: Array<string> };
};
