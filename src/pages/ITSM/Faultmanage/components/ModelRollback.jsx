import React, { useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Row,
  Col
} from 'antd';
import SysDict from '@/components/SysDict';

const { TextArea } = Input;

function ModelRollback(props) {
  const required = true;
  const {
    form: { getFieldDecorator, validateFields, resetFields },
    title, visible, ChangeVisible, flowNodeName
  } = props;

  const [selectdata, setSelectData] = useState([]);
  // const [prevNodeName, setPrevNodeName] = useState('');

  const handleCancel = () => {
    ChangeVisible(false);
  }

  const handleOk = () => {
    validateFields((err, values) => {
      if (!err) {
        handleCancel();
        props.rollbackSubmit(values);
        resetFields();
      }
    })
  }

  const getTypebyTitle = nodetitle => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.title === nodetitle)[0].children;
    }
    return [];
  };

  const currentNodeselect = getTypebyTitle('当前处理环节');
  const prevNodeName = currentNodeselect.map((item, i) => {
    if (flowNodeName === currentNodeselect[i].title) {
      return currentNodeselect[i - 1].title;
    }
    return null;
  });

  return (
    <>
      <Modal
        visible={visible}
        maskClosable={false}
        title={title}
        checkable
        onCancel={handleCancel}
        onOk={handleOk}
      >
        <Row gutter={16}>
          <SysDict
            typeid="333"
            commonid="335"
            ChangeSelectdata={newvalue => setSelectData(newvalue)}
            style={{ display: 'none' }}
          />
          <Form>
            <span style={{ color: 'red', marginLeft: 19 }}>回退至【{prevNodeName}】</span>
            <Col span={22}>
              <Form.Item label='回退意见'>
                {
                  getFieldDecorator('rollbackmsg', {
                    rules: [
                      {
                        required,
                        message: '请说明回退原因'
                      }
                    ]
                  })(<TextArea rows={5} />)
                }
              </Form.Item>
            </Col>
          </Form>
        </Row>
      </Modal>

    </>
  )
}

export default Form.create()(ModelRollback)
