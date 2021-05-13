import React, { useEffect, useState, createContext, useRef } from 'react';
import { connect } from 'dva';
import {
  Card,
  Button,
  Collapse,
  Form
} from 'antd';
import Link from 'umi/link';
import router from 'umi/router';
import TaskCheck from './components/TaskCheck';
import OperationPlanfillin from './components/OperationPlanfillin';
import TaskExecute from './components/TaskExecute';
import OperationPlanfillindes from './components/OperationPlanfillindes';
import TaskCheckdes from './components/TaskCheckdes';
import TaskExecutedes from './components/TaskExecutedes';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SysDict from '@/components/SysDict';
import styles from './index.less';

const { Panel } = Collapse;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 15 },
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

let headTitle;

export const FatherContext = createContext();
function OperationplanCheckfillin(props) {
  // const {
  //   params: { id },
  // } = props.match; // 获取taskId

  const {
    form: { validateFields },
    location: { paneKey },
    match: { params: { id, status, checkoutstatus,executestatus,type } },
    userinfo,
    dispatch, 
  } = props;

  // const title = props.route.name;
  const [flowtype, setFlowtype] = useState('1');
  const [selectdata, setSelectData] = useState('');
  const [files, setFiles] = useState({ arr: [], ischange: false }); // 下载列表
  const SaveRef = useRef();

  const queryDept = () => {
    dispatch({
      type: 'itsmuser/fetchuser',
    });
  };

  const getTypebyTitle = title => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.title === title)[0].children;
    }
    return [];
  };
  const taskResult = getTypebyTitle('作业结果');

  useEffect(() => {
    queryDept();
    headTitle = '';
  }, [])

  const handlePaste = () => {

  }

  const saveApi = (params) => {
    return dispatch({
      type: 'processmodel/savesaveForm',
      payload: params
    })

  }


  const executeSave = () => {
    SaveRef.current.validateFields((err, value) => {
      if (true) {
        const result = {
          ...value,
          start_time: value.start_time.format('YYYY-MM-DD HH:mm:ss'),
          end_time: value.end_time.format('YYYY-MM-DD HH:mm:ss'),
          operation_time: value.operation_time.format('YYYY-MM-DD HH:mm:ss'),
        }
        saveApi(result)
      }

    })
  }

  const delaySave = () => {
    SaveRef.current.validateFields((err, value) => {
      const result = {
        ...value,
        main_addTime: value.main_addTime ? value.main_addTime.format('YYYY-MM-DD HH:mm:ss') : '',
        main_plannedStarTtime: value.main_plannedStarTtime ? value.main_plannedStarTtime.format('YYYY-MM-DD HH:mm:ss') : '',
        main_plannedEndTime: value.main_plannedEndTime ? value.main_plannedEndTime.format('YYYY-MM-DD HH:mm:ss') : '',
      }
      saveApi(result)
    })
  }

  const checkSave = () => {
    SaveRef.current.validateFields((err, value) => {
      const result = {
        ...value,
        check_time: value.check_time.format('YYYY-MM-DD HH:mm:ss'),
      }
      saveApi(result)
    })
  }

  // 上传附件触发保存
  useEffect(() => {
    if (files.ischange) {
      // handlesubmit(0);
      // 保存接口
    }
  }, [files]);


  const handleSave = () => {

  }






  return (
    <PageHeaderWrapper
      title={status}
      extra={
        <>
          <Button type='primary' onClick={handleSave}>保存</Button>


          { status === '待审核' && (
            <>

              <Button type='primary'>
                <Link
                  to='/ITSM/operationplan/operationplansearch'>
                  回退
                </Link>
              </Button>


              <Button type='primary'>
                <Link
                  to='/ITSM/operationplan/operationplansearch'>
                  审核
                </Link>
              </Button>
            </>
          )}




          <Button>
            <Link
              to='/ITSM/operationplan/operationplancheck'>
              返回
            </Link>
          </Button>


        </>
      }
    >
      <SysDict
        typeid="1385513049263181825"
        commonid="1354288354950123522"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <Collapse
        expandIconPosition="right"
        defaultActiveKey={['1']}
        bordered={false}
      >
        {
          (status === '待审核' || status === '已审核') && (
            <Panel
              header='作业计划审核'
              key='1'
              style={{ backgroundColor: 'white' }}
            >
              <FatherContext.Provider value={{ flowtype, setFlowtype }}>
                <TaskCheck
                  formItemLayout={formItemLayout}
                  forminladeLayout={forminladeLayout}
                  type=''
                  userinfo={userinfo}
                  executestatus={executestatus}
                  checkoutstatus={checkoutstatus}
                  ref={SaveRef}
                />
              </FatherContext.Provider>
            </Panel>
          )
        }

      </Collapse>

      <div className={styles.collapse}>
        <Collapse
          expandIconPosition="right"
          bordered={false}
        // defaultActiveKey={['0']}
        // style={{ backgroundColor: 'white' }}
        >
          {/* 后端返回的数据，数据太多，就不mock了 */}
          <Panel
            header='作业计划中'
          >
            <OperationPlanfillindes />
          </Panel>

          <Panel
            header='作业计划审核'
          >
            <TaskCheckdes />
          </Panel>

          <Panel
            header='作业计划执行'
          >
            <TaskExecutedes />
          </Panel>
        </Collapse>
      </div>


    </PageHeaderWrapper>


  )

}

export default Form.create({})(
  connect(({ processmodel, itsmuser, loading }) => ({
    userinfo: itsmuser.userinfo,
    loading: loading.models.processmodel,
  }))(OperationplanCheckfillin)
)