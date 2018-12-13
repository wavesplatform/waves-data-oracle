import * as React from 'react';
import { UploadFile } from 'antd/es/upload/interface';
import { Icon, Upload } from 'antd';
import { If } from 'app/components';
import './edit-form.less';

export class ImageUpload extends React.PureComponent<ImageUpload.IProps, ImageUpload.IState> {

    state = {
        touched: false,
        fileList: [],
        errors: []
    };

    private _handleChange = ({ fileList }: { fileList: Array<UploadFile> }) => {
        const touched = true;

        if (!fileList.length) {
            this.props.onChange(null);
            this.setState({ touched });
            return null;
        }

        const reader = new FileReader();
        reader.onload = () => {
            this.props.onChange(reader.result as string);
        };
        reader.readAsDataURL(fileList[0].originFileObj as File);
        this.setState({ touched });
    };

    public render() {
        const addLogoButton = (
            <div>
                <Icon type="plus"/>
                <div className="ant-upload-text">Upload</div>
            </div>
        );

        const errors = this._getErrors();

        return (
            <div className={'image-upload flex'}>
                <Upload
                    accept={'image/*'}
                    className={'border-round'}
                    listType="picture-card"
                    fileList={this.state.fileList}
                    beforeUpload={() => false}
                    onChange={this._handleChange}
                    showUploadList={{ showPreviewIcon: false }}
                >
                    {!this.state.fileList.length ? addLogoButton : null}
                </Upload>
                <div className="flex flex-col flex-center-v">
                    <div className="margin1">You can upload JPEG photos over 20 KB and PNG photos over 40KB and either type under 25MB.</div>
                    <div className="margin1">You can upload photos that are .JPEG, .JPG, or .PNG.</div>

                    <If condition={this.state.touched}>
                        {errors}
                    </If>
                </div>
            </div>
        );
    }

    private _getErrors() {
        return (this.props.errors || []).map((error, index) => (
            <div key={`image-upload-error-${index}`} className={'error'}>
                {error}
            </div>
        ));
    }

    static getDerivedStateFromProps(props: ImageUpload.IProps, state: ImageUpload.IState): ImageUpload.IState {
        if (props.value) {
            state = {
                ...state, fileList: [
                    {
                        uid: 't-image',
                        thumbUrl: props.value
                    }
                ]
            };
        } else {
            state = {
                ...state, fileList: []
            };
        }

        return state;
    }

}

export namespace ImageUpload {

    export interface IProps {
        onChange: ICallback<string | null, void>;
        value: string | null;
        errors?: Array<string> | null;
    }

    export interface IState {
        touched: boolean;
        fileList: Array<Partial<UploadFile>>;
        errors: Array<string>;
    }

}
