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
  const [formregistrat, setFormregistrat] = useState('');
  const [formhandle, setFormhandle] = useState('');
  const [show, setShow] = useState(false); // 自行处理
  const [check, setCheck] = useState(false); // 审批
  const [flowtype, setFlowtype] = useState('1'); // 流转类型
  const [ischeck, setIscheck] = useState({ save: false, flow: false }); // 是否在校验状态
  const [activeKey, setActiveKey] = useState(['registratform']);
  const RegistratRef = useRef();
  const HandleRef = useRef();

  const callback = key => {
    setActiveKey(key);
  };

  const submittype = type => {
    switch (type) {
      case 'save':
        setIscheck({ ...ischeck, save: true });
        break;
      case 'flow':
        setIscheck({ ...ischeck, flow: true });
        break;
      default:
        break;
    }
  };

  const getregistrat = type => {
    RegistratRef.current.validateFields((err, values) => {
      if (!err) {
        setFormregistrat({
          ...values,
          register_occur_time: values.register_occur_time.format('YYYY-MM-DD HH:mm:ss'),
          register_selfhandle: String(Number(values.register_selfhandle)),
        });
        submittype(type);
      } else {
        setIscheck({ save: false, flow: false });
      }
    });
  };

  const gethandle = type => {
    HandleRef.current.validateFields((err, values) => {
      if (!err) {
        setFormhandle({
          ...values,
          handle_end_time: values.handle_end_time.format('YYYY-MM-DD HH:mm:ss'),
        });
        submittype(type);
      } else {
        setIscheck({ save: false, flow: false });
      }
    });
  };

  const eventsave = () => {
    dispatch({
      type: 'eventregist/eventstart',
      payload: {
        ...formregistrat,
        ...formhandle,
      },
    });
  };

  const eventflow = () => {
    dispatch({
      type: 'eventregist/eventsaveflow',
      payload: {
        formvalue: {
          ...formregistrat,
          ...formhandle,
        },
        flowtype,
      },
    });
  };

  const handlesubmit = () => {
    if (show) {
      getregistrat('save');
      gethandle('save');
    } else {
      getregistrat('save');
    }
  };

  const handleflow = () => {
    if (show) {
      getregistrat('flow');
      gethandle('flow');
    }
    getregistrat('flow');
  };

  useEffect(() => {
    if (ischeck.save) {
      eventsave();
    }
    if (ischeck.flow) {
      eventflow();
    }
  }, [ischeck]);

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
          <Button type="primary" style={{ marginRight: 8 }} onClick={handleflow}>
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
                ChangeCheck={checked => setCheck(checked)}
                ChangeActiveKey={keys => setActiveKey(keys)}
                ChangeFlowtype={type => setFlowtype(type)}
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
