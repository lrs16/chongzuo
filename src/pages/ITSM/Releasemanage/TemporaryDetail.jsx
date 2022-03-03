import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { Button, Card, Spin, message, Collapse, Popconfirm, } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { openNotification } from '@/utils/utils';
import FilesContext from '@/layouts/MenuContext';
import DictLower from '@/components/SysDict/DictLower';
import TemporaryRegistrat from './components/TemporaryRegistrat';
import TemporarySelectUser from './components/TemporarySelectUser';
import TemporaryList from './components/TemporaryList';
import TempTaskLinks from './components/TempTaskLinks';
import { delOrder, saveRegister } from './services/temp';
import { releaseToQuality } from './services/api';

import styles from './index.less';

const { Panel } = Collapse;

const backnode = new Map([
  ['开发商项目经理审核', '出厂测试'],
  ['平台验证', '出厂测试'],
  ['科室负责人审核', '平台验证'],
  ['版本管理员审核', '平台验证'],
  ['自动化科审核', '版本管理员审核'],
  ['中心领导审核', '版本管理员审核'],
  ['业务复核', '版本管理员审核'],
])


function TemporaryDetail(props) {
  const { dispatch, userinfo, location, location: { query: { Id, taskName, taskId } }, info, loading, } = props;
  const pagetitle = props.route.name;

  const [selectdata, setSelectData] = useState({ arr: [], ischange: false }); // 下拉值
  const [uploadStatus, setUploadStatus] = useState(false);
  const [userModleVisible, setUserModleVisible] = useState(false);
  const [type, setType] = useState('1');
  const [indexUser, setIndexUser] = useState([]);
  const [activeKey, setActiveKey] = useState(['form', 'list']);
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [visibleQuality, setVisibleQuality] = useState(false);
  const [clearselect, setClearselect] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const RegistratRef = useRef();

  const openFlow = () => {
    dispatch({
      type: 'releasetemp/openflow',
      payload: {
        releaseNo: Id,
        taskName
      },
    });
  }

  const handleclose = () => {
    router.push({
      pathname: `/ITSM/releasemanage/plan/registration`,
      query: { tabid: sessionStorage.getItem('tabid'), closecurrent: true, }
    });
  };

  const getformvalues = (saveItems, attach) => {
    const val = RegistratRef.current.getVal();
    const register = {
      saveItems,
      releaseNo: val.releaseNo || null,
      releaseMain: {
        id: '',
        releaseNo: val.releaseNo || null,
        releaseType: '临时发布',
        dutyUnit: val.dutyUnit,
        releaseStatus: info?.releaseMain?.releaseStatus || null,
        timeoutTime: info?.releaseMain?.timeoutTime || null,
        remindTime: info?.releaseMain?.remindTime || null,
        revisitWay: info?.releaseMain?.revisitWay || null,
      },
      tempRegister: {
        applicant: val.applicant,
        applicantId: val.applicantId,
        applicantDept: val.applicantDept,
        applicantDeptId: val.applicantDeptId,
        applicantUnit: val.applicantUnit,
        applicantUnitId: val.applicantUnitId,
        tel: val.tel,
        versionNo: val.versionNo,
        releaseLevel: val.releaseLevel,
        planStart: moment(val.planStart).format('YYYY-MM-DD hh:mm:ss'),
        planEnd: moment(val.planEnd).format('YYYY-MM-DD hh:mm:ss'),
        stopBiz: val.stopBiz,
        changeReason: val.changeReason.toString(),
        dutyUnit: val.dutyUnit,
        affectedScope: val.affectedScope,
        practicer: val.practicer,
        guarder: val.guarder,
        member: val.member,
        releaseStep: val.releaseStep,
        risks: val.risks,
        attach: JSON.stringify(attach) || val.attach,
      },
      releaseListList: val.releaseListList,
    };
    return register;
  };

  const getTypebyId = key => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.key === key)[0]?.children || [];
    }
    return [];
  };

  const flowNode = getTypebyId(13266);       // 流程环节
  // 下一环节默认处理人
  const indexUserList = selectdata?.ischange && selectdata.arr.filter(item => item.key === 13263)[0]?.title?.split('-')[1]?.split(',') || [];

  const handleSave = (attach) => {
    const values = getformvalues('register,releaseLists', attach);
    setSaveLoading(true);
    saveRegister(values).then(res => {
      if (res) {
        setSaveLoading(false);
        if (res.code === 200) {
          message.success('保存成功');
          openFlow();
        } else {
          message.error(res.msg || '操作失败');
        }
      } else {
        message.error('操作失败');
        setSaveLoading(false);
      }
    })
  };

  const handleSubmit = (flowtype) => {
    if (taskName === '出厂测试') {
      const values = getformvalues('register,releaseLists');
      saveRegister(values);
    };
    RegistratRef.current.Forms((err) => {
      if (err) {
        openNotification(Object.values(err))
        // message.error('请将信息填写完整')
      } else {
        setType(flowtype);
        setUserModleVisible(true);
        if (flowtype === '1' && flowNode && flowNode.length > 0 && indexUserList && indexUserList.length > 0 && taskName && taskName !== '业务复核') {
          const nextnodename = flowNode[flowNode.findIndex(item => item.title === taskName) + 1]?.title || '';
          const name = indexUserList.filter(obj => obj.indexOf(nextnodename) > -1)
          setIndexUser(name[0]?.split(':')[1]?.split('||') || []);
        }
      }
    })
  };

  const toSubmit = (val) => {
    dispatch({
      type: 'releasetemp/releaseflow',
      payload: { ...val },
    });
  }

  const callback = key => {
    setActiveKey(key);
  };

  // 初始化用户信息，流程类型
  useEffect(() => {
    dispatch({
      type: 'itsmuser/fetchuser',
    });
    sessionStorage.setItem('Processtype', 'temprelease');
    return () => {
      sessionStorage.removeItem('Processtype');
    }
  }, []);

  // 打开待办
  useEffect(() => {
    dispatch({
      type: 'releasetemp/cleardata',
    });
    if (Id && indexUserList && flowNode) {
      // 打开待办
      openFlow();
    }
  }, [Id]);

  const handledel = () => {
    delOrder(Id).then(res => {
      if (res.code === 200) {
        message.success(res.msg);
        handleclose()
      } else {
        message.error(res.msg || '操作失败');
        handleclose()
      }
    })
  };

  const ToQuality = () => {
    if (selectedRecords[0].id) {
      setVisibleQuality(false);
      releaseToQuality({ id: selectedRecords[0].id }).then(res => {
        if (res.code === 200) {
          message.success('操作成功！');
        } else {
          message.error('操作失败！')
        };
        setSelectedRecords([]);
        setClearselect(true)
      })
    }
  }

  const openToQuality = () => {
    if (selectedRecords[0].assessNo) {
      setVisibleQuality(true)
    } else {
      ToQuality()
    }
  };

  const operations = (
    <>
      {info?.releaseTempLogs && info?.releaseTempLogs.length && info?.releaseTempLogs.length === 1 && (
        <Button type="danger" ghost style={{ marginRight: 8 }} onClick={() => handledel()} >删除</Button>
      )}
      {taskName === '出厂测试' ? (
        <>
          <Button type="primary" style={{ marginRight: 8 }} onClick={() => handleSave()} disabled={loading || uploadStatus || !info?.taskInfo?.operationTask || !selectdata.ischange}
          >
            保存
          </Button>
          <Button
            type="primary"
            style={{ marginRight: 8 }}
            disabled={loading || uploadStatus || !info?.taskInfo?.operationTask || !selectdata.ischange}
            onMouseDown={() => setType('')}
            onClick={() => { handleSubmit('1') }}
          >
            流转至开发商项目经理审核
          </Button>
        </>
      ) : (
        <>{taskName !== '发布验证' && taskName !== '业务复核' && taskName !== '结束' && (<>
          <Button
            type="primary"
            style={{ marginRight: 8 }}
            disabled={loading || uploadStatus || !info?.taskInfo?.operationTask}
            onMouseDown={() => setType('')}
            onClick={() => { handleSubmit('3') }}
          >
            {`${taskName?.substring(taskName.length - 2)}不通过`}
          </Button>
          <Button
            type="primary"
            style={{ marginRight: 8 }}
            disabled={loading || uploadStatus || !info?.taskInfo?.operationTask || !selectdata.ischange}
            onMouseDown={() => setType('')}
            onClick={() => { handleSubmit('1') }}
          >
            {`${taskName?.substring(taskName.length - 2)}通过`}
          </Button>
        </>)}
        </>
      )}
      {taskName === '发布验证' && (
        <>
          <Button
            type="primary"
            style={{ marginRight: 8 }}
            disabled={loading || uploadStatus || !info?.taskInfo?.operationTask}
            onMouseDown={() => setType('')}
            onClick={() => { handleSubmit('1') }}
          >
            需要复核
          </Button>
          <Button
            type="primary"
            style={{ marginRight: 8 }}
            disabled={loading || uploadStatus || !info?.taskInfo?.operationTask}
            onMouseDown={() => setType('')}
            onClick={() => { handleSubmit('4') }}
          >
            不需要复核
          </Button>
        </>
      )}
      {taskName === '业务复核' && (
        <>
          <Button
            type="primary"
            style={{ marginRight: 8 }}
            disabled={loading || uploadStatus || !info?.taskInfo?.operationTask || !selectdata.ischange}
            onMouseDown={() => setType('')}
            onClick={() => { handleSubmit('1') }}
          >
            结束
          </Button>
          <Popconfirm
            title="该功能曾发起服务绩效，确定再次发起服务绩效吗?"
            onConfirm={() => ToQuality()}
            visible={visibleQuality}
            onCancel={() => setVisibleQuality(false)}
            placement="leftTop"
          >
            <Button type='primary' onClick={() => openToQuality()} disabled={selectedRecords.length !== 1}>发起服务绩效</Button>
          </Popconfirm>
        </>
      )}

      <Button type="default" onClick={() => handleclose()} >关闭</Button>
    </>
  );

  return (
    <Spin spinning={loading || saveLoading}>
      <PageHeaderWrapper title={pagetitle} extra={operations}>
        <TempTaskLinks taskName={taskName} />
        <div className={styles.tempcollapse}>
          <Collapse
            expandIconPosition="right"
            activeKey={activeKey}
            bordered={false}
            onChange={callback}
          >
            <Panel header='发布基本信息' key="form">
              <div style={{ marginTop: 12 }}>
                <FilesContext.Provider value={{
                  // files: info?.tempRegister?.attach ? JSON.parse(info.tempRegister.attach) : [],
                  ChangeFiles: ((v) => { handleSave(v); }),
                  getUploadStatus: (v) => { setUploadStatus(v) },
                  ChangeButtype: (v) => {
                    if (v === 'submit') {
                      handleSubmit('1')
                    };
                    if (v === 'save' && taskName === '出厂测试') {
                      handleSave()
                    }
                  },
                  getSelectedRecords: (v) => { setSelectedRecords(v) },
                  taskId: info?.taskId,
                  location,
                  clearselect,
                }}>
                  <TemporaryRegistrat
                    wrappedComponentRef={RegistratRef}
                    selectdata={selectdata}
                    info={info}
                    userinfo={userinfo || {}}
                    isEdit={taskName === '出厂测试' && info?.taskInfo?.operationList}
                    taskName={taskName}
                    loading={loading}
                    operationList={info?.taskInfo?.operationList} // 是否可编辑清单
                    location={location}
                    taskId={info?.taskId || taskId}
                  />
                </FilesContext.Provider>
              </div>
            </Panel>
            <Panel header='处理过程' key="list">
              <div style={{ marginTop: 12 }}>
                <TemporaryList
                  dataSource={info?.releaseTempLogs}
                  loading={loading}
                />
              </div>
            </Panel>
          </Collapse>
        </div>
        <DictLower
          typeid="443"
          ChangeSelectdata={newvalue => setSelectData(newvalue)}
          style={{ display: 'none' }}
        />
        <TemporarySelectUser
          title={taskName === '出厂测试' ? '出厂测试结论' : `${taskName}意见`}
          taskId={info?.taskId || taskId}
          type={type}
          visible={userModleVisible}
          ChangeUserVisible={(v) => setUserModleVisible(v)}
          GetVal={(v) => { toSubmit(v) }}
          indexUser={indexUser}
          gobacknode={backnode.get(taskName)}
          taskName={taskName}
        />
      </PageHeaderWrapper >
    </Spin >
  );
}

export default connect(({ itsmuser, releasetemp, loading }) => ({
  userinfo: itsmuser.userinfo,
  info: releasetemp.info,
  loading: loading.models.releasetemp,
}))(TemporaryDetail);
