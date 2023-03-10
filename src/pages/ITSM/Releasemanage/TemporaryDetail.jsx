import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { Button, Spin, message, Collapse, Popconfirm, Badge, Card } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { openNotification } from '@/utils/utils';
import FilesContext from '@/layouts/MenuContext';
import DictLower from '@/components/SysDict/DictLower';
import TemporaryRegistrat from './components/TemporaryRegistrat';
import TemporarySelectUser from './components/TemporarySelectUser';
import TemporaryList from './components/TemporaryList';
import TempTaskLinks from './components/TempTaskLinks';
import { delOrder, saveRegister, exportTempReleaseApply } from './services/temp';
import { releaseToQuality } from './services/api';
import processImg from './img/nWcomAp2dTmXdmnpHm50sQ.png';

const { Panel } = Collapse;

const backnode = new Map([
  ['开发商项目经理审核', '出厂测试'],
  ['平台验证', '出厂测试'],
  ['需求科室审核', '平台验证'],
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
  const [tabActivekey, settabActivekey] = useState('workorder'); // 打开标签

  const RegistratRef = useRef();

  const handleTabChange = key => {
    settabActivekey(key)
  };
  const tabList = [
    {
      key: 'workorder',
      tab: '临时发布工单',
    },
    {
      key: 'process',
      tab: '临时发布流程',
    },
  ];

  const openFlow = (clear) => {
    dispatch({
      type: 'releasetemp/openflow',
      payload: {
        releaseNo: Id,
        taskName,
        clear
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
        planStart: moment(val.planStart).format('YYYY-MM-DD HH:mm:ss'),
        planEnd: moment(val.planEnd).format('YYYY-MM-DD HH:mm:ss'),
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
  const indexUserList = selectdata?.ischange && selectdata.arr.filter(item => item.key === 13281)[0]?.title?.split('-')[1]?.split(',') || [];

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
          const name = indexUserList.filter(obj => obj.indexOf(nextnodename) > -1);
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
      openFlow(true);
    }
  }, [Id]);

  useEffect(() => {
    if (location.state) {
      // 点击菜单刷新,并获取数据
      if (location.state.reset) {
        dispatch({
          type: 'releasetemp/cleardata',
        });
        openFlow(true);
      };
    }
  }, [location.state]);

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

  const handleDownload = () => {
    exportTempReleaseApply(Id).then(res => {
      if (res) {
        const filename = `临时发布申请审批表_${moment().format('YYYY-MM-DD HH:mm')}.docx`;
        const blob = new Blob([res]);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        message.error('导出失败')
      }
    })
  }

  const operations = (
    <>{tabActivekey === 'workorder' && <>
      {info?.releaseTempLogs && info?.releaseTempLogs.length && info?.releaseTempLogs.length === 1 && taskName === '出厂测试' && (
        <Button type="danger" ghost style={{ marginRight: 8 }} onClick={() => handledel()} disabled={loading || uploadStatus || !info?.taskInfo?.operationTask || !selectdata.ischange} >删除</Button>
      )}
      {taskName === '版本管理员审核' && (<Button
        type="primary"
        style={{ marginRight: 8 }}
        onClick={() => handleSubmit('4')} disabled={loading || uploadStatus || !info?.taskInfo?.operationTask || !selectdata.ischange}
      >
        取消发布
      </Button>)}
      {taskName === '出厂测试' ? (
        <>
          <Button
            type="primary"
            style={{ marginRight: 8 }}
            onClick={() => handleSubmit('4')} disabled={loading || uploadStatus || !info?.taskInfo?.showEndBtn || !selectdata.ischange}
          >
            结束
          </Button>
          <Button
            type="primary"
            style={{ marginRight: 8 }}
            onClick={() => handleSave()} disabled={loading || uploadStatus || !info?.taskInfo?.operationTask || !selectdata.ischange}
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
      {taskName === '结束' && <Button type="primary" onClick={() => handleDownload()} >导出Word</Button>}
    </>}
      <Button type="default" onClick={() => handleclose()} >关闭</Button>
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
    <Spin spinning={loading || saveLoading}>
      <PageHeaderWrapper
        title={pagetitle}
        extra={operations}
        tabList={tabList}
        tabActiveKey={tabActivekey}
        onTabChange={handleTabChange}
      >
        {tabActivekey === 'workorder' && <>
          <TempTaskLinks taskName={taskName} releaseTempLogs={info?.releaseTempLogs} />
          <div className='noexplain'>
            <div className='ordercollapse'>
              <Collapse
                expandIconPosition="right"
                activeKey={activeKey}
                bordered={false}
                onChange={callback}
              >
                <Panel header={pheadertitle('发布基本信息', 1)} key="form">
                  {info && (
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
                  )}
                </Panel>
                <Panel header={pheadertitle('处理过程', 2)} key="list">

                  <TemporaryList
                    dataSource={info?.releaseTempLogs}
                    loading={loading}
                  />
                </Panel>
              </Collapse>
            </div>
          </div>
        </>}
        {tabActivekey === 'process' && <Card className='blobimg' ><img src={processImg} alt="" /></Card>}
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
