import React, {
  useEffect, useRef, useState,
  useContext
} from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Button, Card, message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import EditContext from '@/layouts/MenuContext';
import Content from './components/Content';

function New(props) {
  // const pagetitle = props.route.name;
  const {
    dispatch,
    location,
    location: {
      query: {
        Id,
        buttype
      }
    },
    tabnew,
    // tabdata,
    Info,
  } = props;

  const { currenttab } = useContext(EditContext);
  const ContentRef = useRef(null);
  const [pagetitle, setMenuDesc] = useState('');

  useEffect(() => {
    if (currenttab && currenttab.state) {
      setMenuDesc(currenttab.state.menuDesc);
    }
  }, [currenttab])

  useEffect(() => {
    if (Id && (Id !== '' || Id !== undefined)) {
      dispatch({
        type: 'autotask/togetAutoTaskById',
        payload: {
          taskId: Id,
        },
      });
    }
  }, [Id])

  const handleClick = (buttonype) => { // 保存添加
    ContentRef.current.Forms((err, values) => {
      if (err) {
        message.error('请将信息填写完整')
      } else {
        if (buttonype === 'add') { // 添加
          dispatch({
            type: 'autotask/toaddTask',
            payload: {
              ...values,
            },
          }).then(res => {
            if (res.code === 200) {
              message.success(res.msg);
              router.push({
                pathname: `/automation/automatedjob/jobmanagement/jobconfig`,
                query: { pathpush: true },
                state: { cache: false }
              });
            } else {
              message.error(res.msg);
            }
          })
        }
        if (buttonype === 'edit') { // 编辑
          dispatch({
            type: 'autotask/toeditTask',
            payload: {
              ...values,
              id: Id
            },
          }).then(res => {
            if (res.code === 200) {
              message.success(res.msg);
              router.push({
                pathname: `/automation/automatedjob/jobmanagement/jobconfig`,
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
  }

  const handleSubmit = (buttonype) => { // 提交 
    ContentRef.current.Forms((err, values) => {
      if (err) {
        message.error('请将信息填写完整')
      } else {
        dispatch({
          type: 'autotask/tosubmitTask',
          payload: {
            payvalue: { ...values },
            buttype: buttonype,
            taskId: Id,
          },
        })
      }
    })
  };

  const handleDelete = () => { // 删除
    dispatch({
      type: 'autotask/todeleteTask',
      payload: { taskId: Id },
    }).then(res => {
      if (res.code === 200) {
        message.success('删除成功');
        router.push({
          pathname: `/automation/automatedjob/jobmanagement/jobconfig`,
          query: { pathpush: true },
          state: { cache: false }
        });
      } else {
        message.error(res.msg);
      }
    });
  };

  const handleclose = () => { // 返回
    router.push({
      pathname: `/automation/automatedjob/jobmanagement/jobconfig`,
      query: { pathpush: true },
      state: { cache: false }
    });
  };

  // 重置表单信息
  useEffect(() => {
    if (tabnew) {
      ContentRef.current.resetVal();
    }
  }, [tabnew]);

  useEffect(() => {
    // 获取页签信息
    if (location.state) {
      if (location.state.cache) {
        const values = ContentRef.current.getVal();
        dispatch({
          type: 'viewcache/gettabstate',
          payload: {
            cacheinfo: { ...values },
            tabid: sessionStorage.getItem('tabid')
          },
        });
        ContentRef.current.resetVal();   // 页签数据获取完成清空表单
      };
    };
  }, [location])

  const operations = (
    <>
      {
        (Id && (Id !== '' || Id !== undefined)) && (
          <Button
            type="danger"
            ghost
            style={{ marginRight: 8 }}
            onClick={() => handleDelete()}
          >
            删除
          </Button>
        )
      }
      <Button
        type="primary"
        style={{ marginRight: 8 }}
        onClick={() => handleClick(buttype)}
      >
        保存
      </Button>
      <Button
        type="primary"
        style={{ marginRight: 8 }}
        onClick={() => handleSubmit(buttype)}
      >
        提交
      </Button>
      <Button onClick={handleclose}>返回</Button>
    </>
  );

  return (
    <PageHeaderWrapper title={pagetitle} extra={operations}>
      <Card>
        <EditContext.Provider value={{
          editable: true,
          taskId: Id,
          buttype
        }}>
          <Content
            wrappedComponentRef={ContentRef}
            formrecord={Info}
          />
        </EditContext.Provider>
      </Card>
      {/* <EditContext.Provider value={{ setChoiceUser, uservisible, setUserVisible, title: '审核' }}>
        <CheckOneUser userlist={userlist} />
      </EditContext.Provider> */}
    </PageHeaderWrapper>
  );
}

export default connect(({ autotask, viewcache }) => ({
  tabnew: viewcache.tabnew,
  tabdata: viewcache.tabdata,
  Info: autotask.editinfo,
}))(New);
