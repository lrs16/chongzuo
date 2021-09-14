import React, {
  useState, useRef,
  // useContext, 
  useEffect
} from 'react';
import router from 'umi/router';
import { connect } from 'dva';
// import moment from 'moment';
import { Collapse, Button, } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import EditContext from '@/layouts/MenuContext'; // 引用上下文管理组件
import Content from './components/Content';
import Examine from './components/Examine';
// import SoftwareInfoList from './components/SoftwareInfoList';
import styles from './index.less';

const { Panel } = Collapse;

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
const forminladeLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 22 },
  },
};

function Newregist(props) {
  const pagetitle = props.route.name;
  const { dispatch,
    userinfo,
    // location, 
    // loading, 
  } = props;
  const [activeKey, setActiveKey] = useState(['formpanel']);
  const ContentRef = useRef(null);
  const ExmaineRef = useRef(null);

  const callback = key => {
    setActiveKey(key);
  };

  // const handleCheck = (buttype) => { // 审核
  //   ExmaineRef.current.Forms((err) => {
  //     if (err) {
  //       message.error('请将信息填写完整')
  //     } else {
  //       const values = ExmaineRef.current.getVal();
  //       dispatch({
  //         type: 'knowledg/saveorcheck',
  //         payload: {
  //           values: {
  //             ...values,
  //             checkTime: moment(values.checkTime).format('YYYY-MM-DD HH:mm:ss'),
  //             content: values.result === '通过' ? values.content : values.content1,
  //           },
  //           buttype,
  //           mainId: mainId || info.data[0].main.id,
  //           runpath,
  //           editState: info.edit.check === '' ? 'add' : 'edit',
  //           userId: sessionStorage.getItem('userauthorityid')
  //         },
  //       })
  //     }
  //   })
  // };

  const handleclose = () => {
    router.push({
      pathname: `/automation/automatedjob/softstartandstop/softregister`,
      query: { pathpush: true },
      state: { cache: false }
    });
  };

  const ChangeFiles = () => {
    // ContentRef.current.Forms((err, values) => {
    //   if (err) {
    //     message.error('请将信息填写完整')
    //   } else {
    //     dispatch({
    //       type: '',
    //       payload: {
    //         payvalue: { ...values, fileIds: v.length ? JSON.stringify(v) : null },
    //         buttype: 'save',
    //       },
    //     });
    //   }
    // })
  }

  // const handleSubmit = () => { // 审核提交 -- 状态变为已审核
  //   ContentRef.current.Forms((err) => {
  //     if (err) {
  //       message.error('请将信息填写完整')
  //     } else {
  //       knowledgeCheckUserList().then(res => {
  //         if (res.code === 200) {
  //           setUserList(res.data);
  //           setUserVisible(true)
  //         }
  //       })
  //     }
  //   })
  // };

  // 默认展开的panel
  // useEffect(() => {
  //   if (menuDesc && menuDesc === '编辑知识') {
  //     setActiveKey(['formpanel'])
  //   };
  //   if (menuDesc && menuDesc === '知识审核') {
  //     setActiveKey(['formpanel', '1'])
  //   };
  //   if (menuDesc && menuDesc === '知识详情') {
  //     setActiveKey(['1', '2'])
  //   };
  // }, [menuDesc])


  // 加载用户信息
  useEffect(() => {
    dispatch({
      type: 'itsmuser/fetchuser',
    });
  }, []);

  const operations = (
    <>
      <Button
        type="primary"
        style={{ marginRight: 8 }}
      // onClick={() => handleClick('save')}
      >
        保存
      </Button>
      <Button
        type="primary"
        style={{ marginRight: 8 }}
      // onClick={() => { handleSubmit() }}
      >
        提交
      </Button>
      <Button onClick={handleclose}>返回</Button>
    </>
  );
  return (
    <div style={{ marginTop: '-24px' }}>
      <PageHeaderWrapper
        title={pagetitle}
        extra={operations}
      >
        {/* <Spin spinning={loading} > */}
        <div className={styles.collapse}>
          <Collapse
            expandIconPosition="right"
            activeKey={activeKey}
            bordered={false}
            onChange={callback}
          >
            <Panel header='启停登记' key="formpanel">
              <EditContext.Provider value={{
                editable: true,
                files: [],
                ChangeFiles,
              }}>
                <Content
                  wrappedComponentRef={ContentRef}
                  userinfo={userinfo}
                />
              </EditContext.Provider>
            </Panel>
            <Panel header='启停审核' key="formpane2">
              <Examine
                wrappedComponentRef={ExmaineRef}
                check={[]}
                formItemLayout={formItemLayout}
                forminladeLayout={forminladeLayout}
                userinfo={userinfo}
              />
            </Panel>
            {/* <Panel header="软件信息" key="formpane3">
              <SoftwareInfoList />
            </Panel> */}
          </Collapse>
        </div >
        {/* </Spin> */}
      </PageHeaderWrapper>
    </div>
  );
}

export default connect(({ itsmuser }) => ({
  userinfo: itsmuser.userinfo,
}))(Newregist);