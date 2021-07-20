import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Button, Card } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import EditContext from '@/layouts/MenuContext';
import Content from './components/Content';

function New(props) {
  const pagetitle = props.route.name;
  const { dispatch, location, tabnew, tabdata } = props;
  const [files, setFiles] = useState({ arr: [], ischange: false });
  const ContentRef = useRef(null);
  console.log(tabdata)

  const handleSave = () => {
    const values = ContentRef.current.getVal();
    dispatch({
      type: 'knowledg/add',
      payload: { ...values },
    });
  }

  const handleclose = () => {
    router.push({
      pathname: `/ITSM/knowledgemanage/myknowledge`,
      query: { pathpush: true },
      state: { cache: false }
    });
  };

  // 重置表单信息
  useEffect(() => {
    if (tabnew) {
      console.log('重置')
      ContentRef.current.resetVal();
    }
  }, [tabnew]);

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
        onClick={() => handleSave()}
      >
        保存
      </Button>
      <Button
        type="primary"
        style={{ marginRight: 8 }}
        onClick={() => { handleSave() }}
      >
        提交
      </Button>
      <Button onClick={handleclose}>返回</Button>
    </>
  )

  return (
    <PageHeaderWrapper title={pagetitle} extra={operations}>
      <Card>
        <EditContext.Provider value={{ editable: true, files: files.arr, setFiles }}>
          <Content
            wrappedComponentRef={ContentRef}
            formrecord={tabdata}
          />
        </EditContext.Provider>
      </Card>
    </PageHeaderWrapper>
  );
}

export default connect(({ releasetodo, viewcache, loading }) => ({
  tabnew: viewcache.tabnew,
  tabdata: viewcache.tabdata,
  list: releasetodo.list,
  loading: loading.models.releasetodo,
}))(New);