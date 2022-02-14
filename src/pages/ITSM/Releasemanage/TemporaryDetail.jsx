import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { Button, Card, Spin, message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import FilesContext from '@/layouts/MenuContext';
import DictLower from '@/components/SysDict/DictLower';
import TemporaryRegistrat from './components/TemporaryRegistrat';
import TemporarySelectUser from './components/TemporarySelectUser';
import { saveRegister } from './services/temp';

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

// const backnode = new Map([
//   ['开发商项目经理审核', '出厂测试'],
//   ['平台验证', '出厂测试'],
//   ['平台验证', '出厂测试'],
// ])

function TemporaryDetail(props) {
  const { dispatch, userinfo, location, location: { query: { Id, taskName } }, info, loading } = props;
  const pagetitle = props.route.name;

  const [selectdata, setSelectData] = useState({ arr: [], ischange: false }); // 下拉值
  const [saveLoading, setSaveLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(false);
  const [userModleVisible, setUserModleVisible] = useState(false);
  const [type, setType] = useState('1');
  const [registratTaskId, setRegistratTaskId] = useState('');

  const openFlow = () => {
    dispatch({
      type: 'releasetemp/openflow',
      payload: {
        releaseNo: Id,
        taskName
      },
    });
  }

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
    if (Id) {
      // 打开待办
      openFlow();
      // 获取工单历史信息
      // dispatch({
      //   type: 'releaseview/fetchview',
      //   payload: {
      //     releaseNo: Id,
      //   },
      // });
    }
  }, [Id])

  const handleclose = () => {
    router.push({
      pathname: `/ITSM/releasemanage/plan/registration`,
      query: { tabid: sessionStorage.getItem('tabid'), closecurrent: true, }
    });
  };

  const RegistratRef = useRef();
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

  const handleSave = (attach) => {
    const tabid = sessionStorage.getItem('tabid');
    const values = getformvalues('register,releaseLists', attach);
    setSaveLoading(true);
    saveRegister(values).then(res => {
      if (res) {
        setSaveLoading(false);
        if (res.code === 200) {
          message.success('保存成功');
          if (location?.query?.tabid) {
            router.push({
              pathname: `/ITSM/releasemanage/temporary/details`,
              query: {
                Id: res.data.releaseNo,
                // taskId: res.data.taskId,
                taskName: res.data.releaseMain.releaseStatus
              },
              state: {
                runpath: `/ITSM/releasemanage/temporary/list`,
                dynamicpath: true,
                menuDesc: '临时发布工单',
              },
            });
            router.push({
              pathname: `/ITSM/releasemanage/temporary/registration`,
              query: { tabid, closecurrent: true }
            })
          } else {
            openFlow();
          }
        } else {
          message.error(res.msg)
        }
      }
    })
  };

  const handleSubmit = () => {
    const values = getformvalues('register,releaseLists');
    RegistratRef.current.Forms((err) => {
      if (err) {
        message.error('请将信息填写完整')
      } else {
        setSaveLoading(true);
        setType('1');
        saveRegister(values).then(res => {
          if (res) {
            if (res.code === 200) {
              setSaveLoading(false);
              setUserModleVisible(true)
            }
          }
        })
      }
    })
  }

  const operations = (
    <>
      <Button
        type="primary"
        style={{ marginRight: 8 }}
        onClick={() => handleSave()}
        disabled={saveLoading || uploadStatus}
      >
        保存
      </Button>
      <Button
        type="primary"
        style={{ marginRight: 8 }}
        onMouseDown={() => setType('')}
        onClick={() => handleSubmit()}
        disabled={saveLoading || uploadStatus}
      >
        流转至开发商项目经理审核
      </Button>
      <Button type="default" onClick={() => handleclose()} >关闭</Button>
    </>
  );
  return (
    <PageHeaderWrapper title={pagetitle} extra={operations}>
      <Card>
        <FilesContext.Provider value={{
          // files: info?.tempRegister?.attach ? JSON.parse(info.tempRegister.attach) : [],
          ChangeFiles: (v => { handleSave(v) }),
          getUploadStatus: (v) => { setUploadStatus(v) },
          ChangeButtype: (v) => { console.log(v); },
        }}>
          <TemporaryRegistrat
            wrappedComponentRef={RegistratRef}
            selectdata={selectdata}
            info={info || { releaseMain: {}, tempRegister: {}, releaseListList: [] }}
            userinfo={userinfo || {}}
            isEdit
            taskName={location?.query?.tabid ? '新建' : '出厂测试'}
            loading={loading}
            operationList={!!((info?.taskInfo?.operationList || location?.query?.tabid))} // 是否可编辑清单
          />
        </FilesContext.Provider>
      </Card>
      <DictLower
        typeid="443"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <TemporarySelectUser taskId={Id || registratTaskId} type={type} visible={userModleVisible} />
    </PageHeaderWrapper>
  );
}

export default connect(({ itsmuser, releasetemp, loading }) => ({
  userinfo: itsmuser.userinfo,
  info: releasetemp.info,
  loading: loading.models.releasetemp,
}))(TemporaryDetail);
