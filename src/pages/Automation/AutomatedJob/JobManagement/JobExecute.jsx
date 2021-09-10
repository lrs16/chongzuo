import React, {
  // useEffect,
  useState
} from 'react';
// import { connect } from 'dva';
import { Form, } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
// import DictLower from '@/components/SysDict/DictLower';
import TimedExecuteList from './components/TimedExecuteList';
import ManualExecuteList from './components/ManualExecuteList';

const formItemLayout = {
  labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
  },
  wrapperCol: {
      xs: { span: 24 },
      sm: { span: 18 },
  },
};

const tabList = [
  {
      key: 'manualexecute',
      tab: '手动执行',
  },
  {
      key: 'timedexecute',
      tab: '定时执行',
  },
];

function JobExecute(props) {
  const pagetitle = props.route.name;
  const {
      dispatch,
      location,
  } = props;

  // const [selectdata, setSelectData] = useState({ arr: [], ischange: false }); // 下拉值
  const [tabActivekey, settabActivekey] = useState('manualexecute'); // 打开标签

  const handleTabChange = key => {
      settabActivekey(key);
  };

  // 数据字典取下拉值
  // const getTypebyId = key => {
  //     if (selectdata.ischange) {
  //         return selectdata.arr[0].children.filter(item => item.key === key)[0].children;
  //     }
  //     return [];
  // };

  // const scripttypemap = getTypebyId('1429784928986779649'); // 脚本类型
  // const scriptsourcemap = getTypebyId('1429785542332436481'); // 脚本来源
  // const scriptstatusmap = getTypebyId('1429787254489272321'); // 脚本状态

  return (
      <PageHeaderWrapper
          title={pagetitle}
          tabList={tabList}
          tabActiveKey={tabActivekey}
          onTabChange={handleTabChange}
      >
          {/* <DictLower
              typeid="1429784773575233537"
              ChangeSelectdata={newvalue => setSelectData(newvalue)}
              style={{ display: 'none' }}
          /> */}
          {tabActivekey === 'manualexecute' && ( // 手动执行
              <ManualExecuteList
                  formItemLayout={formItemLayout}
                //   dispatch={dispatch}
                //   location={location}
              />
          )}
          {tabActivekey === 'timedexecute' && ( // 定时执行
              <TimedExecuteList
                  dispatch={dispatch}
                  location={location}
                  formItemLayout={formItemLayout}
              />
          )}
      </PageHeaderWrapper>
  );
}

export default Form.create({})(
  // connect(({ scriptconfig, loading }) => ({
  //     manualexecutelist: scriptconfig.manualexecutelist,
  //     loading: loading.models.scriptconfig,
  // }))
  (JobExecute),
);