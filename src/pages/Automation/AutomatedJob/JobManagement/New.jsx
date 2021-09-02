import React, {  useEffect, useRef,
  // useContext 
} from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Button, Card, message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import EditContext from '@/layouts/MenuContext';
import Content from './components/Content';

function New(props) {
  const pagetitle = props.route.name;
  const {
    dispatch,
    location,
    // location: {
    //   query: {
    //     menuDes
    //   }
    // },
    tabnew,
    tabdata,
  } = props;

  const ContentRef = useRef(null);

  const handleClick = () => { // 保存添加
    ContentRef.current.Forms((err, values) => {
      // console.log(values, 'values')
      if (err) {
        message.error('请将信息填写完整')
      } else {
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
    })
  }

  const handleSubmit = () => { // 提交
    // ContentRef.current.Forms((err) => {
    //   if (err) {
    //     message.error('请将信息填写完整')
    //   } else {
    //     knowledgeCheckUserList().then(res => {
    //       if (res.code === 200) {
    //         setUserList(res.data);
    //         setUserVisible(true)
    //       }
    //     })
    //   }
    // })
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
      <Button
        type="primary"
        style={{ marginRight: 8 }}
        onClick={() => handleClick()}
      >
        保存
      </Button>
      <Button
        type="primary"
        style={{ marginRight: 8 }}
        onClick={() => handleSubmit()}
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
        }}>
          <Content
            wrappedComponentRef={ContentRef}
            formrecord={tabdata}
          />
        </EditContext.Provider>
      </Card>
      {/* <EditContext.Provider value={{ setChoiceUser, uservisible, setUserVisible, title: '审核' }}>
        <CheckOneUser userlist={userlist} />
      </EditContext.Provider> */}
    </PageHeaderWrapper>
  );
}

export default connect(({ viewcache }) => ({
  tabnew: viewcache.tabnew,
  tabdata: viewcache.tabdata,
}))(New);
