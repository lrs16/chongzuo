import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { Button, Card, Spin, message, Collapse } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import FilesContext from '@/layouts/MenuContext';
import DictLower from '@/components/SysDict/DictLower';
import TemporaryRegistrat from './components/TemporaryRegistrat';
import TemporarySelectUser from './components/TemporarySelectUser';
import TemporaryList from './components/TemporaryList';
import styles from './index.less';

const { Panel } = Collapse;

// const nextnode = new Map([
//   ['开发商项目经理审核', '平台验证'],
//   ['平台验证', '科室负责人审核'],
//   ['科室负责人审核', '版本管理员审核'],
//   ['版本管理员审核', '自动化科审核'],
//   ['自动化科审核', '中心领导审核'],
//   ['中心领导审核', '发布验证'],
//   ['发布验证', '业务复核'],
//   ['业务复核', '结束'],
// ])


function TemporaryDetail(props) {
  const { dispatch, userinfo, location, location: { query: { Id, taskName, taskId } }, info, loading, } = props;
  const pagetitle = props.route.name;

  const [selectdata, setSelectData] = useState({ arr: [], ischange: false }); // 下拉值
  const [uploadStatus, setUploadStatus] = useState(false);
  const [userModleVisible, setUserModleVisible] = useState(false);
  const [type, setType] = useState('1');
  const [indexUser, setIndexUser] = useState([]);
  const [activeKey, setActiveKey] = useState(['form', 'list']);

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

  const handleSubmit = () => {
    const values = getformvalues('register,releaseLists');
    RegistratRef.current.Forms((err) => {
      if (err) {
        message.error('请将信息填写完整')
      } else {
        console.log(values);
      }
    })
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

  const handlePass = (flowtype, uservisible) => {
    setType(flowtype);
    setUserModleVisible(uservisible);
    if (flowNode && flowNode.length > 0 && indexUserList && indexUserList.length > 0 && taskName) {
      const nextnodename = flowNode[flowNode.findIndex(item => item.title === taskName) + 1]?.title || '';
      const name = indexUserList.filter(obj => obj.indexOf(nextnodename) > -1)
      setIndexUser(name[0]?.split(':')[1]?.split('||') || []);
    }
  }

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

  const operations = (
    <>{taskName === '出厂测试' ? (
      <Button type="primary" style={{ marginRight: 8 }} disabled={loading || uploadStatus}>流转至开发商项目经理审核</Button>
    ) : (
      <>
        <Button
          type="primary"
          style={{ marginRight: 8 }}
          disabled={loading || uploadStatus || !info?.taskInfo?.operationTask}
          onMouseDown={() => setType('')}
          onClick={() => { setType('3') }}
        >
          {`${taskName?.substring(taskName.length - 2)}不通过`}

        </Button>
        <Button
          type="primary"
          style={{ marginRight: 8 }}
          disabled={loading || uploadStatus || !info?.taskInfo?.operationTask || !selectdata.ischange}
          onMouseDown={() => setType('')}
          onClick={() => { handlePass('1', true) }}
        >
          {`${taskName?.substring(taskName.length - 2)}通过`}
        </Button>
      </>
    )
    }
      <Button type="primary" onClick={() => handleclose()} >结束</Button>
      <Button type="default" onClick={() => handleclose()} >关闭</Button>
    </>
  );

  return (
    <Spin spinning={loading}>
      <PageHeaderWrapper title={pagetitle} extra={operations}>
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
                  ChangeFiles: (v => { console.log(v); }),
                  getUploadStatus: (v) => { setUploadStatus(v) },
                  ChangeButtype: (v) => { console.log(v); },
                  taskId: info?.taskId,
                  location,
                }}>
                  <TemporaryRegistrat
                    wrappedComponentRef={RegistratRef}
                    selectdata={selectdata}
                    info={info}
                    userinfo={userinfo || {}}
                    isEdit={taskName === '出厂测试'}
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
