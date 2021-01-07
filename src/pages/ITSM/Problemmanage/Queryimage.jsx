import React, { useEffect } from 'react';
import {
  Card,
  Form,
  Button,
} from 'antd';
import { connect } from 'dva';
import Link from 'umi/link';
import route from 'umi/router';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import Problemflow from './components/Problemflow';

let imageId;

function Queryimage(props) {
  const pagetitle = props.route.name;
  useEffect(() => {
    getInformation();
  }, []);

  const {
    dispatch,
    queryDetaildata,
  } = props;

  const {
    params: { id },
  } = props.match;

  if (queryDetaildata.main) {
    imageId = queryDetaildata.main.id;
  }

  const getInformation = () => {
    dispatch({
      type: 'problemmanage/queryDetail',
      payload: { id },
    })
    };

  const tabList = [
    {
      key: 'queryworkdetail',
      tab: '查询工单',
    },
    {
      key: 'process',
      tab: '问题流程',
    },
  ];

  const handleTabChange = key => {
    switch (key) {
      case 'queryworkdetail':
        route.push(`/ITSM/problemmanage/querydetail/${id}/queryworkdetail`);
        break;
      case 'process':
        route.push(`/ITSM/problemmanage/querydetail/${id}/process`);
        break;
      default:
        break;
    }
  }
  const { match, children, location } = props;

  return (
    <PageHeaderWrapper 
    title={pagetitle}
    extra={
      <>
        <Button style={{ marginRight: 8 }}>
          <Link to="/ITSM/problemmanage/besolved">返回</Link>
        </Button>
      </>
    }
    tabList={tabList}
    tabActiveKey={location.pathname.replace(`${match.path}/`, '')}
    onTabChange={handleTabChange}
    >
      <Card>
         <Problemflow id={imageId} />
      </Card>
   
    </PageHeaderWrapper>
  );
}
export default Form.create({})(
  connect(({ problemmanage, loading }) => ({
    queryDetaildata: problemmanage.queryDetaildata,
    loading: loading.models.problemmanage,
  }))(Queryimage),
);
