import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Button, Card } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import EditContext from '@/layouts/MenuContext';
import { knowledgeCheckUserList } from '@/services/user';
import CheckOneUser from '@/components/SelectUser/CheckOneUser';
import Content from './components/Content';

function New(props) {
  const pagetitle = props.route.name;
  const { dispatch, location, tabnew, tabdata } = props;
  const [choiceUser, setChoiceUser] = useState({ users: '', ischange: false });
  const [userlist, setUserList] = useState([]);
  const [uservisible, setUserVisible] = useState(false); // 是否显示选人组件
  const ContentRef = useRef(null);

  const handleClick = (buttype) => {
    const values = ContentRef.current.getVal();
    dispatch({
      type: 'knowledg/add',
      payload: {
        payvalue: { ...values },
        buttype,
        userId: choiceUser.users
      },
    });
  }

  const handleSubmit = () => {
    knowledgeCheckUserList().then(res => {
      if (res.code === 200) {
        setUserList(res.data);
        setUserVisible(true)
      }
    })
  };

  const handleclose = () => {
    router.push({
      pathname: `/ITSM/knowledgemanage/myknowledge`,
      query: { pathpush: true },
      state: { cache: false }
    });
  };

  const ChangeFiles = (v) => {
    const values = ContentRef.current.getVal();
    dispatch({
      type: 'knowledg/add',
      payload: { ...values, fileIds: v.length ? JSON.stringify(v) : '' },
    });
  }

  // 重置表单信息
  useEffect(() => {
    if (tabnew) {
      ContentRef.current.resetVal();
    }
  }, [tabnew]);

  // 选人完成提交
  useEffect(() => {
    if (choiceUser.ischange) {
      handleClick('submit');
      setChoiceUser({ users: '', ischange: false });
    }
  }, [choiceUser.ischange])

  // 获取页签信息
  useEffect(() => {
    if (location.state && location.state.cache) {
      const values = ContentRef.current.getVal();
      dispatch({
        type: 'viewcache/gettabstate',
        payload: {
          cacheinfo: { ...values },
          tabid: sessionStorage.getItem('tabid')
        },
      });
    }
  }, [location])

  const operations = (
    <>
      <Button
        type="primary"
        style={{ marginRight: 8 }}
        onClick={() => handleClick('save')}
      >
        保存
      </Button>
      <Button
        type="primary"
        style={{ marginRight: 8 }}
        onClick={() => { handleSubmit() }}
      >
        提交
      </Button>
      <Button onClick={handleclose}>返回</Button>
    </>
  )

  return (
    <PageHeaderWrapper title={pagetitle} extra={operations}>
      <Card>
        <EditContext.Provider value={{
          editable: true,
          files: [],
          ChangeFiles,
        }}>
          <Content
            wrappedComponentRef={ContentRef}
            formrecord={tabdata}
          />
        </EditContext.Provider>
      </Card>
      <EditContext.Provider value={{ setChoiceUser, uservisible, setUserVisible, title: '审核' }}>
        <CheckOneUser userlist={userlist} />
      </EditContext.Provider>
    </PageHeaderWrapper>
  );
}

export default connect(({ releasetodo, viewcache, loading }) => ({
  tabnew: viewcache.tabnew,
  tabdata: viewcache.tabdata,
  list: releasetodo.list,
  loading: loading.models.releasetodo,
}))(New);