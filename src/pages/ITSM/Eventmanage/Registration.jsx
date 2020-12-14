import React, { useState, createContext, useRef } from 'react';
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
  const [activeKey, setActiveKey] = useState(['registratform']);
  // console.log(registratkeys);
  const RegistratRef = useRef();
  const HandleRef = useRef();

  const callback = key => {
    setActiveKey(key);
  };

  const getregistrats = () => {
    RegistratRef.current.validateFields((err, values) => {
      if (!err) {
        console.log(values);
      }
    });
  };

  const gethandles = () => {
    HandleRef.current.validateFields((err, values) => {
      if (!err) {
        console.log(values);
      }
    });
  };

  const handlesubmit = () => {
    if (show) {
      getregistrats();
      gethandles();
    }
    getregistrats();
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
          <Panel header="事件登记" key="registratform">
            <Registrat
              ChangeShow={isshow => setShow(isshow)}
              ChangeActiveKey={keys => setActiveKey(keys)}
              formItemLayout={formItemLayout}
              forminladeLayout={forminladeLayout}
              show={show}
              ref={RegistratRef}
            />
          </Panel>
          {show === true && (
            <Panel header="事件处理" key="handleform">
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
