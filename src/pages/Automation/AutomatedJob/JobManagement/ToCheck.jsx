import React, { useState, useRef, useEffect } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import moment from 'moment';
import { Collapse, Button, message, Spin } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import Examine from './components/Examine';
import Contentdes from './components/Contentdes';
import { addExamineTask } from './services/api';

import styles from './index.less';

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

function ToCheck(props) {
  const pagetitle = props.route.name;
  const { dispatch,
    userinfo,
    location,
    loadingInfo,
    location: {
      query: {
        Id,
      }
    },
    checkInfo,
  } = props;

  const [activeKey, setActiveKey] = useState(['formpanel', 'formpanel1']);
  const ExmaineRef = useRef(null);

  const { selectedRows } = location.state;

  const callback = key => {
    setActiveKey(key);
  };

  // 审核保存
  const handleExamineClick = () => {
    ExmaineRef.current.Forms((err) => {
      if (err) {
        message.error('请将信息填写完整')
      } else {
        const values = ExmaineRef.current.getVal();
        values.examineTime = values.examineTime ? moment(values.examineTime).format('YYYY-MM-DD HH:mm:ss') : '';
        if (values.id && values.id !== "") { // 编辑时id不为空
          dispatch({
            type: 'autotask/toupdExamineTask',
            payload: {
              ...values,
              taskId: Id,
            },
          }).then(res => {
            if (res.code === 200) {
              message.success(res.msg);
              router.push({
                pathname: `/automation/automatedjob/jobmanagement/jobcheck`,
                query: { pathpush: true },
                state: { cache: false }
              });
            } else {
              message.error(res.msg);
            }
          })
        } else {
          dispatch({
            type: 'autotask/toaddexamineTask',
            payload: {
              ...values,
              taskId: Id,
            },
          }).then(res => {
            if (res.code === 200) {
              message.success(res.msg);
              router.push({
                pathname: `/automation/automatedjob/jobmanagement/jobcheck`,
                query: { pathpush: true },
                state: { cache: false }
              });
            } else {
              message.error(res.msg);
            }
          })
        }
      }
    })
  };

  // 返回
  const handleclose = () => {
    router.push({
      pathname: `/automation/automatedjob/jobmanagement/jobcheck`,
      query: { pathpush: true },
      state: { cache: false }
    });
  };

  // 审核提交
  const handleExamineSubmit = () => { // 审核提交 -- 通过状态变为3已审核，不通过状态改为1已登记
    ExmaineRef.current.Forms((err) => {
      if (err) {
        message.error('请将信息填写完整')
      } else {
        const values = ExmaineRef.current.getVal();
        values.examineTime = values.examineTime ? moment(values.examineTime).format('YYYY-MM-DD HH:mm:ss') : '';
        values.taskId = Id;
        addExamineTask({ ...values }).then(resp => {
          if (resp.code === 200) {
            dispatch({
              type: 'autotask/toexaminesubmitTask',
              payload: {
                taskId: Id,
                taskStatus: values.examineStatus === '1' ? '3' : '1',
              },
            }).then(res => {
              if (res.code === 200) {
                message.success(res.msg);
                router.push({
                  pathname: `/automation/automatedjob/jobmanagement/jobcheck`,
                  query: { pathpush: true },
                  state: { cache: false }
                });
              } else {
                message.error(res.msg);
              }
            })
          } else {
            message.error(resp.msg);
          }
        })
      }
    })
  };

  // 加载用户信息
  useEffect(() => {
    dispatch({
      type: 'itsmuser/fetchuser',
    });
  }, []);

  // 获取数据编辑
  useEffect(() => {
    if (Id && (Id !== '' || Id !== undefined)) {
      dispatch({
        type: 'autotask/togetexamineTaskList',
        payload: {
          taskId: Id,
        },
      });
    }
  }, [Id])

  const operations = (
    <>
      <Button
        type="primary"
        style={{ marginRight: 8 }}
        onClick={() => handleExamineClick()}
      >
        保存
      </Button>
      <Button
        type="primary"
        style={{ marginRight: 8 }}
        onClick={() => handleExamineSubmit()}
      >
        提交
      </Button>
      <Button onClick={handleclose}>返回</Button>
    </>
  );

  return (
    <div style={{ marginTop: '-24px' }}>
      <PageHeaderWrapper
        title={pagetitle}
        extra={operations}
      >
        <Spin spinning={loadingInfo} >
          <div className={styles.collapse}>
            <Collapse
              expandIconPosition="right"
              activeKey={activeKey}
              bordered={false}
              onChange={callback}
            >
              <Panel header='作业任务审批' key="formpanel">
                <Examine
                  wrappedComponentRef={ExmaineRef}
                  checkInfo={checkInfo && checkInfo[0]}
                  formItemLayout={formItemLayout}
                  forminladeLayout={forminladeLayout}
                  userinfo={userinfo}
                />
              </Panel>
              <Panel header="作业任务" key="formpanel1">
                <Contentdes 
                  formItemLayout={formItemLayout} 
                  forminladeLayout={forminladeLayout} 
                  contentInfo={selectedRows} 
                  dispatch={dispatch} 
                />
              </Panel>
            </Collapse>
          </div >
        </Spin>
      </PageHeaderWrapper>
    </div>
  );
}

export default connect(({ autotask, itsmuser, loading }) => ({
  userinfo: itsmuser.userinfo,
  checkInfo: autotask.editcheckinfo,
  loadingInfo: loading.effects['autotask/togetexamineTaskList']
}))(ToCheck);