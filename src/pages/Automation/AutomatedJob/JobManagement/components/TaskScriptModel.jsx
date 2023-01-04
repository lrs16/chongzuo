import React, { useState } from 'react';
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
  const [data, setData] = useState([]);

  const handleCancel = () => {
    setVisible(false);
  };

  const handleopenClick = () => {
    setVisible(true);
    dispatch({
      type: 'autotask/findtaskScriptList1',
      payload: {
        taskId: id,
        pageNum: 1,
        pageSize: 15,
      },
    }).then(res => {
      if (res.code === 200) {
        setData(res.data.rows);
      }
    });
  };

  return (
    <>
      {withClick(children, handleopenClick)}
      <Modal
        title='作业脚本'
        onCancel={() => handleCancel()}
        footer={null}
        visible={visible}
        width={1000}
        bodyStyle={{ overflow: 'hidden' }}
      >
        <Tabs
          className={styles.tabs}
        >
          {data.map((item, index) => (
            <TabPane tab={`脚本${index + 1}`} key={item.id} style={{ marginTop: 15 }}>
              <h4 style={{ marginLeft: 50 }}>{`脚本${index + 1}【${item.scriptName}】`}</h4>
              <Form {...formItemLayout} style={{ borderWidth: 1, borderStyle: 'solid', borderColor: 'rgba(233, 233, 233, 1)', marginTop: 15, padding: '20px 0 0 10px' }}>
                <Form.Item label="脚本名称" >
                  <Input defaultValue={item.scriptName} disabled />
                </Form.Item>
                <Form.Item label="脚本类型">
                  <Radio.Group value={item.scriptType} disabled>
                    <Radio value='shell'>shell</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item label="脚本内容">
                  <TextArea autoSize={{ minRows: 30 }} defaultValue={item.scriptCont} disabled />
                </Form.Item>
                <Form.Item label="负责人">
                  <Input defaultValue={item.director} disabled />
                </Form.Item>
                <Form.Item label="脚本参数">
                  <Input defaultValue={item.scriptArgs} disabled />
                </Form.Item>
                <Form.Item label="脚本备注">
                  <TextArea autoSize={{ minRows: 3 }} defaultValue={item.scriptRemarks} disabled />
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