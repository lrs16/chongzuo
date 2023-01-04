import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import { Button, Card, message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import TickemergentRegistrat from './components/TickemergentRegistrat';
import { openNotification } from '@/utils/utils';
import { saveTickRegister, getUserList } from './services/tick';

function TickemergentRegistration(props) {
  const pagetitle = props.route.name;
  const RegistratRef = useRef();
  const {
    dispatch,
    location,
    location: {
      query: { Id },
    },
    tabnew,
    tabdata,
    userinfo,
  } = props;

  const [userlist, setUserList] = useState();
  const [saveLoading, setSaveLoading] = useState(false);

  // 关闭
  const handleclose = () => {
    router.push({
      pathname: `/ITSM/faultmanage/tickemergent/registration`,
      query: { tabid: sessionStorage.getItem('tabid'), closecurrent: true },
    });
  };

  // 打开待办
  const openFlow = () => {
    dispatch({
      type: 'tickemergent/openflow',
      payload: {
        Id,
      },
    });
  };

  // 保存
  const handleSave = () => {
    const tabid = sessionStorage.getItem('tabid');
    const values = RegistratRef.current?.getVal();
    const val = {
      ...values,
      registerTime: moment(values.registerTime).format('YYYY-MM-DD HH:mm:ss'),
      occurrenceTime: moment(values.occurrenceTime).format('YYYY-MM-DD HH:mm:ss'),
    };
    setSaveLoading(true);
    saveTickRegister(val).then(res => {
      if (res) {
        setSaveLoading(false);
        if (res.code === 200) {
          message.success('保存成功');
          if (location?.query?.tabid) {
            router.push({
              pathname: `/ITSM/faultmanage/tickemergent/details`,
              query: {
                Id: res.mainId,
                taskName: res.taskName,
              },
              state: {
                dynamicpath: true,
                menuDesc: '应急抢修票工单',
              },
            });
            router.push({
              pathname: `/ITSM/faultmanage/tickemergent/registration`,
              query: { tabid, closecurrent: true },
            });
          } else {
            openFlow();
          }
        } else {
          message.error(res.msg);
        }
      }
    });
  };

  // 提交
  const handleSubmit = () => {
    const values = RegistratRef.current?.getVal();
    const vals = {
      ...values,
      registerTime: values.registerTime.format('YYYY-MM-DD HH:mm:ss'),
      occurrenceTime: values.occurrenceTime.format('YYYY-MM-DD HH:mm:ss'),
    };
    RegistratRef.current.Forms(err => {
      if (err) {
        openNotification(Object.values(err));
      } else {
        setSaveLoading(true);
        saveTickRegister(vals).then(res => {
          if (res) {
            if (res.code === 200) {
              setSaveLoading(false);
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
    // 获取页签信息
    if (location.state) {
      if (location.state.cache) {
        const values = RegistratRef.current?.getVal();
        dispatch({
          type: 'viewcache/gettabstate',
          payload: {
            cacheinfo: {
              ...values,
              registerTime: values.registerTime.format('YYYY-MM-DD HH:mm:ss'),
              occurrenceTime: values.occurrenceTime.format('YYYY-MM-DD HH:mm:ss'),
            },
            tabid: sessionStorage.getItem('tabid'),
          },
        });
        RegistratRef.current.resetVal(); // 页签数据获取完成清空表单
      }
    }
  }, [location]);

  return (
    <PageHeaderWrapper
      title={pagetitle}
      extra={
        <>
          <Button
            type="primary"
            style={{ marginRight: 8 }}
            onClick={() => handleSave()}
            disabled={saveLoading}
          >
            保 存
          </Button>
          <Button
            type="primary"
            style={{ marginRight: 8 }}
            onClick={() => handleSubmit()}
            disabled={saveLoading}
          >
            提 交
          </Button>
          <Button type="default" onClick={() => handleclose()}>
            关 闭
          </Button>
        </>
      }
    >
      <div className="noexplain noregpad">
        <Card>
          <TickemergentRegistrat
            wrappedComponentRef={RegistratRef}
            formrecord={tabdata}
            userinfo={userinfo || {}}
            location={location}
            userlist={userlist} // 获取确认人列表
          />
        </Card>
      </div>
    </PageHeaderWrapper>
  );
}

export default connect(({ viewcache, itsmuser }) => ({
  tabnew: viewcache.tabnew,
  tabdata: viewcache.tabdata,
  userinfo: itsmuser.userinfo, // 默认人
}))(TickemergentRegistration);
