import * as React from 'react';
import { UploadFile } from 'antd/es/upload/interface';
import { Icon, Upload } from 'antd';
import { If } from 'app/components';
import './edit-form.less';
import { FormComponent, IState } from '../FormComponent';


const addLogoButton = (
    <div>
        <Icon type="plus"/>
        <div className="ant-upload-text">Upload</div>
    </div>
);


export namespace ImageUpload {
    
    export interface IProps {
        onChange: ICallback<string | null, void>;
        value: string | null;
        errors?: Array<string> | null;
    }
}


export class ImageUpload extends FormComponent<string|null, IState<string>> {

    _changeHandler = ({ fileList }: { fileList: Array<UploadFile> }) => {
        this.setState({ touched: true });
    
        if (!fileList.length) {
            this.changeHandler(null);
            return null;
        }
        
        const reader = new FileReader();
        
        reader.onload = () => {
            this.changeHandler(reader.result as string);
        };
        
        reader.readAsDataURL(fileList[0].originFileObj as File);
    };

    public render() {
        const errors = this._getErrors();
        const fileList = this.state.value ? [{
            uid: 't-image',
            thumbUrl: this.state.value || ''
        }] : [];
        
        return (
            <div className={'image-upload flex'}>
                <Upload
                    accept={'image/svg'}
                    className={'border-round'}
                    listType="picture-card"
                    fileList={fileList as any}
                    beforeUpload={() => false}
                    onChange={this._changeHandler}
                    showUploadList={{ showPreviewIcon: false }}
                >
                    {!fileList.length ? addLogoButton : null}
                </Upload>
                <div className="flex flex-col flex-center-v">
                    <div className="margin1">You can upload JPEG photos over 20 KB and PNG photos over 40KB and either type under 25MB.</div>
                    <div className="margin1">You can upload photos that are .JPEG, .JPG, or .PNG.</div>

                    <If condition={!this.state.isValid}>
                        {errors}
                    </If>
                </div>
            </div>
        );
    }

    private _getErrors() {
        return (this.state.errors || []).map((error: string, index: number) => (
            <div key={`image-upload-error-${index}`} className={'error'}>
                {error}
            </div>
        ));
    }

    static getDerivedStateFromProps(props: { value: string }, state: IState<string>) {
        return { ...state, value: props.value };
    }

}
