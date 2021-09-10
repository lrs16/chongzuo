import React, { useState } from 'react';
// import { connect } from 'dva';
import {
    Form,
    Modal,
    Tabs,
    Input,
    Radio,
} from 'antd';
import styles from '../index.less';

const { TabPane } = Tabs;
const { TextArea } = Input;

const formItemLayout = {
    labelCol: {
        xs: { span: 2 },
        sm: { span: 0 },
    },
    wrapperCol: {
        xs: { span: 22 },
        sm: { span: 20 },
    },
    colon: false,
};
const tabList = [
    {
        key: 'script',
        tab: '脚本一',
    },
    {
        key: 'script1',
        tab: '脚本二',
    },
];

// 克隆子元素按钮，并添加事件
const withClick = (element, handleClick = () => { }) => {
    return <element.type {...element.props} onClick={handleClick} />;
};

function TaskScriptModel(props) {
    const {
        children,
        dispatch,
    } = props;

    const { id } = props.record;
    const [visible, setVisible] = useState(false);
    // const [tabActivekey, settabActivekey] = useState('script'); // 打开标签
    const [data, setData] = useState([]);

    // 列表
    const getlistdata = (page, size) => {
        dispatch({
            type: 'autotask/findtaskScriptList1',
            payload: {
                id,
                pageNum: page,
                pageSize: size,
            },
        }).then(res => {
            if (res.code === 200) {
                setData(res.data);
            }
        });
    };

    const handleCancel = () => {
        setVisible(false);
    };

    const handleopenClick = () => {
        setVisible(true);
        getlistdata(1, 15);
    };

    // const handleTabChange = key => {
    //     settabActivekey(key);
    // };



    return (
        <>
            {withClick(children, handleopenClick)}
            <Modal
                title='作业脚本'
                onCancel={() => handleCancel()}
                footer={null}
                visible={visible}
                width={1000}
                centered
                maskClosable
                closable
            >
                <Tabs
                    className={styles.tabs}
                // activeKey={tabActivekey}
                // onTabChange={handleTabChange}
                >
                    {tabList.map(item => (
                        <TabPane tab={item.tab} key={item.key} >
                            <h4>脚本三【临时表空间文件Tomcat巡检】</h4>
                            <Form {...formItemLayout} style={{ borderWidth: 1, borderStyle: 'solid', borderColor: 'rgba(233, 233, 233, 1)', marginTop: 40, padding: '20px 0 0 10px' }}>
                                <Form.Item label="脚本名称" >
                                    <Input defaultValue="{record.scriptName}" disabled />
                                </Form.Item>
                                <Form.Item label="脚本类型">
                                    <Radio.Group value="{record.scriptType}" disabled>
                                        <Radio value='shell'>shell</Radio>
                                    </Radio.Group>
                                </Form.Item>
                                <Form.Item label="脚本内容">
                                    <TextArea autoSize={{ minRows: 30 }} defaultValue="{record.scriptCont}" disabled />
                                </Form.Item>
                                <Form.Item label="负责人">
                                    <Input defaultValue="{record.director}" disabled />
                                </Form.Item>
                                <Form.Item label="脚本参数">
                                    <Input defaultValue="{record.scriptArgs}" disabled />
                                </Form.Item>
                                <Form.Item label="脚本备注">
                                    <TextArea autoSize={{ minRows: 3 }} defaultValue="{record.scriptRemarks}" disabled />
                                </Form.Item>
                            </Form>
                        </TabPane>
                    ))}
                </Tabs>
            </Modal>
        </>
    );
}

export default Form.create({})(TaskScriptModel);