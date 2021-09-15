import React, {
  useState, useRef,
  // useContext, 
  useEffect
} from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import moment from 'moment';
import { Collapse, Button, message } from 'antd';
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
    location: {
      query: {
        // Id,
        buttype
      }
    },
  } = props;
  const [activeKey, setActiveKey] = useState(['formpanel']);
  const [exeminefiles, setexemineFiles] = useState({ arr: [], ischange: false }); // 审核上传
  const ContentRef = useRef(null);
  const ExmaineRef = useRef(null);
  const [formregistrat, setFormregistrat] = useState({});
  const [formcheck, setFormcheck] = useState({});

  console.log(formregistrat, formcheck, '11')

  const callback = key => {
    setActiveKey(key);
  };

  const handleSaveClick = (buttonype) => { // 保存添加
    ContentRef.current.Forms((err) => {
      const values = ContentRef.current?.getVal();
      setFormregistrat({
        ...values,
        createTime: moment(values.createTime).format('YYYY-MM-DD HH:mm:ss'),
      });
      if (!err) {
        ExmaineRef.current.Forms((error) => {
          if (!error) {
            const val = ExmaineRef.current?.getVal();
            setFormcheck({
              ...val,
              examineTime: moment(val.examineTime).format('YYYY-MM-DD HH:mm:ss'),
              examineFiles: JSON.stringify(exeminefiles.arr),
            });
            dispatch({
              type: 'autosoftwork/toaddAutoSoftWork',
              payload: {
                autoSoftWork: formregistrat,
                autoSoftWorkExamine: formcheck,
              },
            });
          } else {
            message.error('请将审核表单填写完整！');
          }
        });
      } else {
        message.error('请将登记表单填写完整！');
      }
    });
  };

  // const handleCheck = (buttype) => { // 审核
  //   ExmaineRef.current.Forms((err) => {
  //     if (err) {
  //       message.error('请将信息填写完整')
  //     } else {
  //       const values = ExmaineRef.current.getVal();
  //       dispatch({
  //         type: '',
  //         payload: {
  //           ...values,
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
        onClick={() => handleSaveClick(buttype)}
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
              }}>
                <Content
                  wrappedComponentRef={ContentRef}
                  userinfo={userinfo}
                />
              </EditContext.Provider>
            </Panel>
            <Panel header='启停审核' key="formpanel2">
              <Examine
                wrappedComponentRef={ExmaineRef}
                check={[]}
                ChangeFiles={newvalue => { setexemineFiles(newvalue) }}
                files={[]}
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