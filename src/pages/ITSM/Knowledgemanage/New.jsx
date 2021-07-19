import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Button, Card } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import EditContext from '@/layouts/MenuContext';
import Content from './components/Content';

const test = "[{\"uid\":\"5d99d4ef91aa41dcaa36ab5256a944e0\",\"name\":\"QQ图片20201211113431.png\",\"fileUrl\":\"\",\"status\":\"done\"},{\"uid\":\"34839bb212964b3d8367da685b0404d3\",\"name\":\"QQ图片20210114115718.png\",\"fileUrl\":\"\",\"status\":\"done\"},{\"uid\":\"f7867554b99d4636b27dec8c1027c53f\",\"name\":\"aaaaaaaaaav1.0.pdf\",\"fileUrl\":\"\",\"status\":\"done\"},{\"uid\":\"8490ebd1c740475ba45cb0f422849508\",\"name\":\"QQ图片20210114115718.png\",\"nowtime\":\"2021-07-12 11:29:34\",\"fileUrl\":\"\",\"status\":\"done\"}]"

function New(props) {
  const pagetitle = props.route.name;
  const { dispatch, location, tabnew, tabdata } = props;
  const [files, setFiles] = useState({ arr: JSON.parse(test), ischange: false });
  const ContentRef = useRef(null);

  const handleSave = () => {
    const values = ContentRef.current.getVal();
    console.log(values);
    ContentRef.current.Forms((err) => {

    })
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
            formrecord={tabdata === undefined ? {} : tabdata}
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