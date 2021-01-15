import React, { useState, useRef, useEffect } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { Collapse, Steps, Spin } from 'antd';
import { DatePicker } from 'antd';
import styles from './index.less';
import { DingdingOutlined } from '@ant-design/icons';
import Registrat from './components/Registrat';
import Examine from './components/Examine';
import Track from './components/Track';
import Registratdes from './components/Registratdes';

const { Panel } = Collapse;
const { Step } = Steps;

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

function WorkOrder(props) {
  const {
    dispatch,
    location,
    records,
    info,
    userinfo,
    loading,
    validate,
    type,
    changValidate,
  } = props;
  const [activeKey, setActiveKey] = useState(['form']);
  const { taskName, taskId, mainId } = location.query;
  // const [ischeck, setIscheck] = useState(false); // 是否在校验状态
  // const [flowtype, setFlowtype] = useState('1'); // 流转类型
  const [files, setFiles] = useState([]); // 下载列表

  // 初始化用户信息，流程类型
  useEffect(() => {
    dispatch({
      type: 'itsmuser/fetchuser',
    });
    sessionStorage.setItem('Processtype', 'demand');
  }, []);
  // 更新流转类型
  useEffect(() => {
    sessionStorage.setItem('flowtype', 1);
  }, []);

  // 刷新路由
  // 登记表单
  const RegistratRef = useRef();

  const getregistrats = () => {
    if (type === 'save') {
      const values = RegistratRef.current.getFieldsValue();
      dispatch({
        type: 'demandtodo/demandregisterupdate',
        payload: {
          paloadvalues: {
            ...values,
            creationTime: values.creationTime.format(),
            registerTime: values.registerTime.format(),
            functionalModule: values.functionalModule.join('/'),
            nextUser: sessionStorage.getItem('userauthorityid'),
            id: info.demandForm.id,
          },
          processInstanceId: mainId,
        },
      });
    }
    if (type === 'flow') {
      RegistratRef.current.validateFields((err, values) => {
        if (!err) {
          dispatch({
            type: 'demandregister/startandnext',
            payload: {
              ...values,
              creationTime: values.creationTime.format(),
              registerTime: values.registerTime.format(),
              functionalModule: values.functionalModule.join('/'),
              nextUserIds: sessionStorage.getItem('userauthorityid').split(','),
              // nextUser: sessionStorage.getItem('userName'),
              taskId,
            },
          });
        }
      });
    }
  };
  // 需求审核，运维审核,需求复核表单
  const setid = () => {
    const { historys } = info;
    const infotaskName = info.taskName;
    if (historys !== [] && historys?.slice(-1)[0].taskName === infotaskName) {
      return info.historys?.slice(-1)[0].id;
    }
    if (historys === [] || historys?.slice(-1)[0]?.taskName !== infotaskName) {
      return '';
    }
    return null;
  };
  const ExamineRef = useRef();
  const getdemandexamine = () => {
    const id = setid();
    if (type === 'save') {
      const values = ExamineRef.current.getFieldsValue();
      dispatch({
        type: 'demandtodo/demandsave',
        payload: {
          ...values,
          reviewTime: values.reviewTime.format(),
          business: Number(values.business),
          releases: Number(values.releases),
          nextUserIds: sessionStorage.getItem('userauthorityid').split(),
          registerId: info.demandForm.id,
          id,
          taskName: info.taskName,
        },
      });
    }
    if (type === 'flow') {
      ExamineRef.current.validateFields((err, values) => {
        if (!err) {
          dispatch({
            type: 'demandtodo/demandnextstep',
            payload: {
              ...values,
              reviewTime: values.reviewTime.format(),
              nextUserIds: sessionStorage.getItem('userauthorityid').split(),
              taskId,
              registerId: info.demandForm.id,
              id: info.historys[info.historys.length - 1].id,
              taskName: info.taskName,
            },
          });
        }
      });
    }
  };
  // 需求跟踪
  const TrackRef = useRef();
  const getdemantrack = () => {
    const id = setid();
    if (type === 'save') {
      const values = ExamineRef.current.getFieldsValue();
      dispatch({
        type: 'demandtodo/demandsave',
        payload: {
          ...values,
          reviewTime: values.reviewTime.format(),
          nextUserIds: sessionStorage.getItem('userauthorityid').split(),
          registerId: info.demandForm.id,
          id,
          taskName: info.taskName,
        },
      });
    }
    if (type === 'flow') {
      ExamineRef.current.validateFields((err, values) => {
        if (!err) {
          dispatch({
            type: 'demandtodo/demandnextstep',
            payload: {
              ...values,
              reviewTime: values.reviewTime.format(),
              nextUserIds: sessionStorage.getItem('userauthorityid').split(),
              taskId,
              registerId: info.demandForm.id,
              id: info.historys[info.historys.length - 1].id,
              taskName: info.taskName,
            },
          });
        }
      });
    }
  };
  const handleflow = () => {
    switch (taskName) {
      case '需求登记': {
        getregistrats();
        break;
      }
      case '需求审核':
      case '运维审核':
      case '需求复核':
        getdemandexamine();
        break;
      case '开发跟踪':
        getdemantrack();
        break;
      case '需求确认':
        // getdemandexamine();
        break;
      default:
        break;
    }
  };
  useEffect(() => {
    handleflow();
  }, [type]);

  const callback = key => {
    setActiveKey(key);
  };
  // 加载流程记录，加载编辑历史
  useEffect(() => {
    dispatch({
      type: 'demandtodo/demandrecords',
      payload: {
        processId: mainId,
      },
    });
    dispatch({
      type: 'demandtodo/demandopenflow',
      payload: {
        processInstanceId: mainId,
      },
    });
  }, [mainId]);

  return (
    <div className={styles.collapse}>
      {records !== '' && (
        <Steps
          current={records.length - 1}
          progressDot
          style={{
            background: '#fff',
            padding: 24,
            border: '1px solid #e8e8e8',
            overflowX: 'auto',
          }}
        >
          {records.map((obj, index) => {
            const desc = (
              <div>
                <div>{moment(obj.time).format('YYYY-MM-DD hh:mm:ss')}</div>
              </div>
            );
            return <Step title={obj.taskName} description={desc} key={index.toString()} />;
          })}
        </Steps>
      )}
      <Spin spinning={loading}>
        {loading === false && info !== '' && (
          <Collapse
            expandIconPosition="right"
            activeKey={activeKey}
            bordered={false}
            onChange={callback}
            style={{ marginTop: '-25px' }}
          >
            <Panel header={taskName} key="form">
              {taskName === '需求登记' && (
                <Registrat
                  formItemLayout={formItemLayout}
                  forminladeLayout={forminladeLayout}
                  files={
                    info.demandForm.attachment !== ''
                      ? JSON.parse(info.demandForm.attachment)
                      : files
                  }
                  ChangeFiles={newvalue => {
                    setFiles(newvalue);
                  }}
                  ref={RegistratRef}
                  register={info.demandForm}
                  userinfo={userinfo}
                />
              )}
              {taskName === '需求审核' && (
                <Examine
                  ref={ExamineRef}
                  formItemLayout={formItemLayout}
                  forminladeLayout={forminladeLayout}
                  text="审核"
                  userinfo={userinfo}
                  taskName={info.taskName}
                  info={
                    info.historys?.slice(-1)[0].taskName === info.taskName
                      ? info.historys.slice(-1)
                      : undefined
                  }
                />
              )}
              {taskName === '运维审核' && (
                <Examine
                  ref={ExamineRef}
                  formItemLayout={formItemLayout}
                  forminladeLayout={forminladeLayout}
                  text="运维"
                  // register={info.demandForm}
                  userinfo={userinfo}
                  taskName={info.taskName}
                  info={
                    info.historys?.slice(-1)[0].taskName === info.taskName
                      ? info.historys.slice(-1)
                      : undefined
                  }
                />
              )}
              {taskName === '需求复核' && (
                <Examine
                  ref={ExamineRef}
                  formItemLayout={formItemLayout}
                  forminladeLayout={forminladeLayout}
                  text="复核"
                  userinfo={userinfo}
                  taskName={info.taskName}
                  info={
                    info.historys?.slice(-1)[0].taskName === info.taskName
                      ? info.historys.slice(-1)
                      : undefined
                  }
                />
              )}
              {taskName === '需求跟踪' && (
                <Track
                  ref={TrackRef}
                  userinfo={userinfo}
                  taskName={info.taskName}
                  info={
                    info.historys?.slice(-1)[0].taskName === info.taskName
                      ? info.historys.slice(-1)
                      : undefined
                  }
                  demandId={info.demandForm.demandId}
                />
              )}
            </Panel>

            <Panel header="需求登记" key="registdes">
              <Registratdes info={info.demandForm} />
            </Panel>

            {/* {data.map((obj, index) => {
              // panel详情组件
              const Paneldesmap = new Map([
                ['register', <Registratdes info={Object.values(obj)[0]} main={data[0].main} />],
                ['handle', <Handledes info={Object.values(obj)[0]} main={data[0].main} />],
                ['check', <Checkdes info={Object.values(obj)[0]} main={data[0].main} />],
                ['finish', <ReturnVisitdes info={Object.values(obj)[0]} main={data[0].main} />],
              ]);

              if (index > 0)
                return (
                  <Panel Panel header={Panelheadermap.get(Object.keys(obj)[0])} key={index}>
                    {Paneldesmap.get(Object.keys(obj)[0])}
                  </Panel>
                );
            })} */}
          </Collapse>
        )}
      </Spin>
    </div>
  );
}

export default connect(({ demandtodo, itsmuser, demandregister, loading }) => ({
  userinfo: itsmuser.userinfo,
  records: demandtodo.records,
  info: demandtodo.info,
  demandregister,
  loading: loading.effects['demandtodo/demandopenflow'],
}))(WorkOrder);
