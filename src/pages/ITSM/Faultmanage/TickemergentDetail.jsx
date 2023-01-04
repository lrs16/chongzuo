import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { Button, Collapse, Popconfirm, Badge, message, Spin } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import TickemergentRegistrat from './components/TickemergentRegistrat';
import ProcessList from './components/ProcessList';
import RelationOrderTick from './RelationOrderTick';
import FlowChart from './components/ChartFiles/FlowChart';
import RemarkModel from './components/RemarkModel';
import { openNotification } from '@/utils/utils';
import { getRepairHisLogList } from './services/tick';

import {
  delRepairOrder,
  exportTickemegentApply,
  saveTickRegister,
  getUserList,
} from './services/tick';

const { Panel } = Collapse;

function TickemergentDetail(props) {
  const {
    dispatch,
    location,
    location: {
      query: { Id, taskId, todo },
    },
    info,
    loading,
  } = props;

  const pagetitle = props.route.name;

  const [activeKey, setActiveKey] = useState(['workorder', 'processlist']);
  const [tabActivekey, settabActivekey] = useState('workorder'); // 打开标签
  const [visible, setVisible] = useState(false);
  const [userlist, setUserList] = useState();
  const [logslist, setLogslist] = useState();

  const RegistratRef = useRef();

  const handleTabChange = key => {
    settabActivekey(key);
  };

  const tabList = [
    {
      key: 'workorder',
      tab: '应急抢修票',
    },
    {
      key: 'relevancy',
      tab: '关联工单',
    },
  ];

  const openFlow = clear => {
    dispatch({
      type: 'tickemergent/openflow',
      payload: {
        mainId: Id,
        taskId,
        clear,
        todo,
      },
    });
  };

  // 初始化用户信息, 确认人列表
  useEffect(() => {
    dispatch({
      type: 'itsmuser/fetchuser',
    });
    getUserList().then(res => {
      if (res.code === 200) {
        setUserList({ ...res.data });
      } else {
        message.error('获取确认人列表失败');
      }
    });
  }, []);

  // 打开待办
  useEffect(() => {
    dispatch({
      type: 'tickemergent/cleardata',
    });
    if (Id && Id !== undefined) {
      openFlow(true);
      getRepairHisLogList(Id).then(res => {
        // 流程图
        setLogslist({ ...res.data });
      });
    }
  }, [Id]);

  // 保存
  const handleSave = () => {
    const values = RegistratRef.current?.getVal();
    const vals = {
      ...values,
      registerTime: moment(values.registerTime).format('YYYY-MM-DD HH:mm:ss'),
      occurrenceTime: moment(values.occurrenceTime).format('YYYY-MM-DD HH:mm:ss'),
    };
    saveTickRegister(vals).then(res => {
      if (res) {
        if (res.code === 200) {
          message.success('保存成功');
          openFlow();
        } else {
          message.error(res.msg || '操作失败');
        }
      } else {
        message.error('操作失败');
      }
    });
  };

  // 流转
  const handleSubmit = () => {
    const values = RegistratRef.current?.getVal();
    const vals = {
      ...values,
      registerTime: moment(values.registerTime).format('YYYY-MM-DD HH:mm:ss'),
      occurrenceTime: moment(values.occurrenceTime).format('YYYY-MM-DD HH:mm:ss'),
    };
    RegistratRef.current.Forms(err => {
      if (err) {
        openNotification(Object.values(err));
      } else {
        saveTickRegister(vals).then(res => {
          if (res) {
            if (res.code === 200) {
              const val = {
                mainId: res.mainId,
                remark: '新建抢修票',
                taskName: res.taskName,
              };
              dispatch({
                type: 'tickemergent/repairSubmit',
                payload: {
                  ...val,
                },
              });
            }
          }
        });
      }
    });
  };

  // 确认工作，完成工作
  const handlefirmSubmit = v => {
    const val = {
      mainId: info?.task?.mainId,
      remark: v.remark,
      taskName: info?.task?.taskName,
    };
    dispatch({
      type: 'tickemergent/repairSubmit',
      payload: {
        ...val,
      },
    });
  };

  // 关闭
  const handleclose = () => {
    router.push({
      pathname: `/ITSM/faultmanage/tickemergent/details`,
      query: { tabid: sessionStorage.getItem('tabid'), closecurrent: true },
    });
  };

  const callback = key => {
    setActiveKey(key);
  };

  // 删除
  const handleDelete = () => {
    delRepairOrder(Id).then(res => {
      if (res.code === 200) {
        message.success(res.msg);
        handleclose();
      } else {
        message.error(res.msg || '操作失败');
        handleclose();
      }
    });
  };

  // 导出WORD
  const handleDownload = () => {
    exportTickemegentApply(Id).then(res => {
      if (res) {
        const filename = `应急抢修票_${moment().format('YYYY-MM-DD HH:mm')}.docx`;
        const blob = new Blob([res]);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        message.error('导出失败');
      }
    });
  };

  const extras = (
    <>
      {tabActivekey === 'workorder' && (
        <>
          {info?.task?.taskName === '抢修票登记' && (
            <Popconfirm title="确定删除吗？" onConfirm={() => handleDelete()}>
              <Button type="danger" style={{ marginRight: 8 }} ghost>
                删除
              </Button>
            </Popconfirm>
          )}
          <Button type="primary" style={{ marginRight: 8 }} onClick={() => handleDownload()}>
            导出WORD
          </Button>
          {(info?.task?.taskName === '待开发商确认' ||
            info?.task?.taskName === '待许可人确认' ||
            info?.task?.taskName === '待签发人确认' ||
            info?.task?.taskName === '待接收人确认' ||
            info?.task?.taskName === '抢修负责人总结') && (
            <Button type="primary" style={{ marginRight: 8 }} onClick={() => setVisible(true)}>
              确认工作
            </Button>
          )}
          {info?.task?.taskName === '值班员确认' && (
            <Button type="primary" style={{ marginRight: 8 }} onClick={() => setVisible(true)}>
              完成工作
            </Button>
          )}
          {info?.task?.taskName === '抢修票登记' && (
            <Button type="primary" style={{ marginRight: 8 }} onClick={() => handleSave()}>
              保存
            </Button>
          )}
          {info?.task?.taskName === '抢修票登记' && (
            <Button type="primary" style={{ marginRight: 8 }} onClick={() => handleSubmit()}>
              流转
            </Button>
          )}
        </>
      )}
      <Button type="default" onClick={() => handleclose()}>
        关闭
      </Button>
    </>
  );

  const pheadertitle = (title, index) => {
    return (
      <>
        <Badge
          count={index}
          style={{
            backgroundColor: '#C1EB08',
            color: '#10C510',
            boxShadow: '0 0 0 1px #10C510 inset',
            marginRight: 4,
            marginBottom: 2,
          }}
        />
        <span>{title}</span>
      </>
    );
  };

  return (
    <Spin spinning={loading}>
      <PageHeaderWrapper
        title={pagetitle}
        extra={extras}
        tabList={tabList}
        tabActiveKey={tabActivekey}
        onTabChange={handleTabChange}
      >
        {tabActivekey === 'workorder' && (
          <>
            {/* 流程图 */}
            {logslist && <FlowChart data={logslist} divHeight={350} nodeSize={230} />}
            <div className="noexplain">
              <div className="ordercollapse">
                <Collapse
                  expandIconPosition="right"
                  activeKey={activeKey}
                  bordered={false}
                  onChange={callback}
                >
                  <Panel header={pheadertitle('应急抢修票登记', 1)} key="workorder">
                    {info?.main && (
                      <TickemergentRegistrat
                        wrappedComponentRef={RegistratRef}
                        formrecord={info?.main || {}}
                        unedit={info?.task?.taskName !== '抢修票登记'} // 登记页可编辑
                        userlist={userlist}
                      />
                    )}
                  </Panel>
                  <Panel header={pheadertitle('处理过程', 2)} key="processlist">
                    {info?.his && <ProcessList procelist={info?.his || []} loading={loading} />}
                  </Panel>
                </Collapse>
              </div>
            </div>
          </>
        )}
        {tabActivekey === 'relevancy' && <RelationOrderTick location={location} relation />}
        <RemarkModel
          title="填写确认说明"
          visible={visible}
          ChangeVisible={v => setVisible(v)}
          toconfirmSubmit={v => handlefirmSubmit(v)}
        />
      </PageHeaderWrapper>
    </Spin>
  );
}

export default connect(({ tickemergent, loading }) => ({
  info: tickemergent.info,
  loading: loading.models.tickemergent,
}))(TickemergentDetail);
