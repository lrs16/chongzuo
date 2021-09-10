import React from 'react';
import { Modal, Form, Input, Radio } from 'antd';

const { TextArea } = Input;

const formItemLayout = {
    labelCol: {
        xs: { span: 3 },
        sm: { span: 0 },
    },
    wrapperCol: {
        xs: { span: 22 },
        sm: { span: 20 },
    },
    colon: false,
};

function AviewMadel(props) {
    const { visible, title, ChangeVisible, detaildata } = props;

    // const { scriptName, scriptType, scriptCont, director, scriptArgs, scriptRemarks, } = props.detaildata;

    const handleCancel = () => {
        ChangeVisible(false);
    };

    return (
        <Modal
            title={title}
            width={1000}
            bodyStyle={{ overflow: 'hidden' }}
            footer={null}
            visible={visible}
            onCancel={() => handleCancel()}
        >
            <Form {...formItemLayout}>
                <Form.Item label="脚本名称" >
                    <Input defaultValue={detaildata.scriptName} disabled />
                </Form.Item>
                <Form.Item label="脚本类型">
                    <Radio.Group value={detaildata.scriptType} disabled>
                        <Radio value='shell'>shell</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label="脚本内容">
                    <TextArea autoSize={{ minRows: 30 }} defaultValue={detaildata.scriptCont} disabled />
                </Form.Item>
                <Form.Item label="负责人">
                    <Input defaultValue={detaildata.director} disabled />
                </Form.Item>
                <Form.Item label="脚本参数">
                    <Input defaultValue={detaildata.scriptArgs} disabled />
                </Form.Item>
                <Form.Item label="脚本备注">
                    <TextArea autoSize={{ minRows: 3 }} defaultValue={detaildata.scriptRemarks} disabled />
                </Form.Item>
            </Form>
        </Modal>
    );
}

AviewMadel.defaultProps = {
    record: { scriptName: '', scriptType: '', scriptCont: '', director: '', scriptArgs: '', scriptRemarks: '', },
};

export default Form.create()(AviewMadel);