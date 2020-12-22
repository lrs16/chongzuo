import React, { useState, createContext, useRef, useEffect } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { Card, Button, Collapse, message, Spin } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './index.less';
import Handle from './components/Handle';
import Registrat from './components/Registrat';
import Check from './components/Check';

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
  const { dispatch, loading } = props;
  const [show, setShow] = useState(false);
  const [check, setCheck] = useState(false);
  const [activeKey, setActiveKey] = useState(['registratform']);
  const RegistratRef = useRef();
  const HandleRef = useRef();
  console.log(check);

  const callback = key => {
    setActiveKey(key);
  };

  const getregistrat = () => {
    RegistratRef.current.validateFields((err, values) => {
      if (!err) {
        const { register_occur_time, register_selfhandle } = values;
        dispatch({
          type: 'eventregist/eventstart',
          payload: {
            ...values,
            register_selfhandle: String(Number(register_selfhandle)),
            register_occur_time: register_occur_time.format('YYYY-MM-DD HH:mm:ss'),
          },
        });
      }
    });
  };

  const gethandle = () => {
    HandleRef.current.validateFields((err, values) => {
      if (!err) {
        console.log(values);
      }
    });
  };

  const getcheck = () => {
    HandleRef.current.validateFields((err, values) => {
      if (!err) {
        console.log(values);
      }
    });
  };

  const handlesubmit = () => {
    if (show) {
      getregistrat();
      gethandle();
    }
    getregistrat();
  };

  const handleclose = () => {
    router.push({
      pathname: `/ITSM/eventmanage/to-do`,
    });
  };

  return (
    <PageHeaderWrapper title={pagetitle}>
      <Spin tip="正在提交数据..." spinning={Boolean(loading)}>
        <Card style={{ textAlign: 'right' }}>
          <Button type="primary" style={{ marginRight: 8 }} onClick={handlesubmit}>
            保 存
          </Button>
          <Button type="primary" style={{ marginRight: 8 }}>
            流 转
          </Button>
          <Button type="default" onClick={handleclose}>
            关 闭
          </Button>
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
                ChangeCheck={ischeck => setCheck(ischeck)}
                ChangeActiveKey={keys => setActiveKey(keys)}
                formItemLayout={formItemLayout}
                forminladeLayout={forminladeLayout}
                show={show}
                ref={RegistratRef}
              />
            </Panel>
            {show === true && check === false && (
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
      </Spin>
    </PageHeaderWrapper>
  );
}

export default connect(({ loading }) => ({
  loading: loading.models.eventregist,
}))(Registration);
