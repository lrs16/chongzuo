import React, { useState, createContext, createRef, useRef } from 'react';
import { Card, Form, Button, Collapse } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './index.less';
import Handle from './components/Handle';
import Registrat from './components/Registrat';

const { Panel } = Collapse;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};
const forminladeLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 22 },
  },
};

export const RegistratContext = createContext();

function Registration(props) {
  const pagetitle = props.route.name;
  const [show, setShow] = useState(false);
  const [activeKey, setActiveKey] = useState(['1']);
  // console.log(registratkeys);
  const RegistratRef = useRef();
  const HandleRef = useRef();

  const callback = key => {
    setActiveKey(key);
  };

  const handlesubmit = () => {
    RegistratRef.current.validateFields((err, values) => {
      if (!err) {
        console.log(values);
      }
    });
    HandleRef.current.validateFields((err, values) => {
      if (!err) {
        console.log(values);
      }
    });
  };

  return (
    <PageHeaderWrapper title={pagetitle}>
      <Card style={{ textAlign: 'right' }}>
        <Button type="primary" style={{ marginRight: 8 }} onClick={handlesubmit}>
          保 存
        </Button>
        <Button type="primary" style={{ marginRight: 8 }}>
          流 转
        </Button>
        <Button type="default">关 闭</Button>
      </Card>
      <div className={styles.collapse}>
        <Collapse
          expandIconPosition="right"
          // defaultActiveKey={['1']}
          activeKey={activeKey}
          bordered={false}
          style={{ marginTop: '-25px' }}
          onChange={callback}
        >
          <Panel header="事件登记" key="1">
            <RegistratContext.Provider value={{ setActiveKey, setShow }}>
              <Registrat
                formItemLayout={formItemLayout}
                forminladeLayout={forminladeLayout}
                show={show}
                ref={RegistratRef}
              />
            </RegistratContext.Provider>
          </Panel>
          {show === true && (
            <Panel header="事件处理" key="2">
              <Handle
                formItemLayout={formItemLayout}
                forminladeLayout={forminladeLayout}
                ref={HandleRef}
              />
            </Panel>
          )}
        </Collapse>
      </div>
    </PageHeaderWrapper>
  );
}

export default Form.create({})(Registration);
