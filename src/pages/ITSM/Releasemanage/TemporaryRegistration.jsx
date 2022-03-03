import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import { Button, Card, Spin, message, notification } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { openNotification } from '@/utils/utils';
import { querkeyVal } from '@/services/api';
import FilesContext from '@/layouts/MenuContext';
import DictLower from '@/components/SysDict/DictLower';
import TemporaryRegistrat from './components/TemporaryRegistrat';
import TemporarySelectUser from './components/TemporarySelectUser';
import { saveRegister } from './services/temp';

function TemporaryRegistration(props) {
  const { dispatch, userinfo, location, location: { query: { Id, taskName } }, info, loading, tabnew, tabdata } = props;
  const pagetitle = props.route.name;

  const [selectdata, setSelectData] = useState({ arr: [], ischange: false }); // 下拉值
  const [saveLoading, setSaveLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(false);
  const [userModleVisible, setUserModleVisible] = useState(false);
  const [type, setType] = useState('1');
  const [registratTaskId, setRegistratTaskId] = useState('');
  const [indexUser, setIndexUser] = useState([]);
  const indexvalue = { releaseMain: {}, tempRegister: { planStart: moment(), planEnd: moment() }, releaseListList: [] };

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

  const openNotificationWithIcon = (arr) => {
    notification.error({
      message: '请将以下信息填写完整',
      description: <>
        <div>111</div>
        <div>222</div>
      </>
      ,
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
        // message.error('请将信息填写完整')
        openNotification(Object.values(err));
      } else {
        setSaveLoading(true);
        setType('1');
        saveRegister(values).then(res => {
          if (res) {
            if (res.code === 200) {
              setRegistratTaskId(res.data.taskId);
              setSaveLoading(false);
              setUserModleVisible(true)
            }
          }
        })
      }
    })
  };

  const toSubmit = (val) => {
    dispatch({
      type: 'releasetemp/releaseflow',
      payload: { ...val },
    });
  }


  // 初始化用户信息，流程类型
  useEffect(() => {
    dispatch({
      type: 'itsmuser/fetchuser',
    });
    sessionStorage.setItem('Processtype', 'temprelease');
    querkeyVal('release', 'indexuser').then(res => {
      if (res.code === 200) {
        const arr = res.data.indexuser[0]?.val?.split('-')[1]?.split(',') || [];
        const name = arr.filter(obj => obj.indexOf('开发商项目经理审核') > -1)
        setIndexUser(name[0]?.split(':')[1]?.split('||') || []);
      }
    });
    return () => {
      sessionStorage.removeItem('Processtype');
    }
  }, []);

  // 重置表单信息
  useEffect(() => {
    if (tabnew) {
      RegistratRef.current.resetVal();
    }
  }, [tabnew]);

  useEffect(() => {
    if (location.state && location.state.reset) {
      // 点击菜单刷新,并获取数据
      RegistratRef.current.resetVal();
    }
  }, [location.state]);

  useEffect(() => {
    // 清除tasklinks值
    dispatch({
      type: 'releaseview/cleardata',
    });
    // 获取页签信息
    if (location.state) {
      if (location.state.cache) {
        const register = getformvalues();
        dispatch({
          type: 'viewcache/gettabstate',
          payload: {
            cacheinfo: register,
            tabid: sessionStorage.getItem('tabid')
          },
        });
        RegistratRef.current.resetVal();   // 页签数据获取完成清空表单
      };
    };
  }, [location]);

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
      {location?.query?.tabid ? (
        <Button
          type="primary"
          style={{ marginRight: 8 }}
          onMouseDown={() => setType('')}
          onClick={() => handleSubmit()}
          disabled={saveLoading || uploadStatus}
        >
          流转至开发商项目经理审核
        </Button>
      ) : (<Button disabled={info?.taskInfo?.operationTask && !!loading}>流转至000</Button>)}
      <Button type="default" onClick={() => handleclose()} >关闭</Button>
    </>
  );
  return (
    <PageHeaderWrapper title={pagetitle} extra={operations}>
      <Card>
        <FilesContext.Provider value={{
          // files: info?.tempRegister?.attach ? JSON.parse(info.tempRegister.attach) : [],
          ChangeFiles: ((v) => { handleSave(v); }),
          getUploadStatus: (v) => { setUploadStatus(v) },
          ChangeButtype: () => { },
        }}>
          <TemporaryRegistrat
            wrappedComponentRef={RegistratRef}
            selectdata={selectdata}
            info={tabdata || indexvalue}
            userinfo={userinfo || {}}
            isEdit
            taskName='新建'
            loading={loading}
            operationList // 是否可编辑清单
            location={location}
            taskId={Id}
          />
        </FilesContext.Provider>
      </Card>
      <DictLower
        typeid="443"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <TemporarySelectUser
        title='出厂测试结论'
        taskId={registratTaskId}
        type={type}
        visible={userModleVisible}
        ChangeUserVisible={(v) => setUserModleVisible(v)}
        GetVal={(v) => { toSubmit(v) }}
        indexUser={indexUser}
      />
    </PageHeaderWrapper>
  );
}

export default connect(({ viewcache, itsmuser }) => ({
  tabnew: viewcache.tabnew,
  tabdata: viewcache.tabdata,
  userinfo: itsmuser.userinfo,
}))(TemporaryRegistration);
