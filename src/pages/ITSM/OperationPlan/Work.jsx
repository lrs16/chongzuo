import React, { useEffect, useState, createContext,useRef } from 'react';
import { connect } from 'dva';
import {
  Card,
  Button,
  Collapse,
  Form
} from 'antd';
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
function Work(props) {
  // const {
  //   params: { id },
  // } = props.match; // 获取taskId

  const {
    form: {validateFields},
    location: { paneKey },
    match: { params: { id, executestatus, checkoutstatus, type } },
    userinfo,
    dispatch
  } = props;

  // const title = props.route.name;
  const [flowtype, setFlowtype] = useState('1');
  const [selectdata, setSelectData] = useState('');
  const SaveRef = useRef();

  if (executestatus === '未完成' && checkoutstatus === '已审核') {
    headTitle = '作业计划执行'
  }

  if (executestatus === '已延期') {
    headTitle = '作业计划延期'
  }

  if (executestatus !== '已延期' && executestatus !== '未完成' && checkoutstatus !== '已审核') {
    headTitle = executestatus
  }

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
    console.log('ff')
  }

  const saveApi = (params) => {
    console.log('params: ', params);
    return dispatch ({
      type: 'processmodel/savesaveForm',
      payload: params
    })

  }

  
  const executeSave = () => {
    SaveRef.current.validateFields((err,value) => {
      if(true) {
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
    SaveRef.current.validateFields((err,value) => {
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
    SaveRef.current.validateFields((err,value) => {
      const result = {
        ...value,
        check_time: value.check_time.format('YYYY-MM-DD HH:mm:ss'),
      }
      saveApi(result) 
    })
  }

  
  const handleSave = () => {
    if(executestatus === '未完成' && checkoutstatus === '已审核') {
      console.log(1)
      executeSave();
    }

    if (executestatus === '已延期') {
      console.log(2)
      delaySave();
    }

    if ((checkoutstatus === '待审核' || checkoutstatus === '已审核') && executestatus === '作业计划审核') {
      console.log(3)
      checkSave();
    }
  }

  


  return (
    <PageHeaderWrapper
      title={headTitle}
      extra={
        <>

          <Button type='primary' onClick={handleSave}>保存</Button>

          <Button type='primary'>送审</Button>

          <Button type='primary' onClick={handlePaste}>粘贴</Button>


        
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
          (checkoutstatus === '待审核' || checkoutstatus === '已审核') && executestatus === '作业计划审核' && (
            <Panel
              header='作业计划审核'
              key='1'
              style={{ backgroundColor: 'white' }}
            >
              <FatherContext.Provider value={{ flowtype, setFlowtype }}>
                <TaskCheck
                  formItemLayout={formItemLayout}
                  forminladeLayout={forminladeLayout}
                  type={type}
                  userinfo={userinfo}
                  executestatus={executestatus}
                  checkoutstatus={checkoutstatus}
                  ref={SaveRef}
                />
              </FatherContext.Provider>
            </Panel>
          )
        }


        {executestatus === '未完成' && checkoutstatus === '已审核' && (
          <Panel
            header='作业计划执行'
            key='1'
            style={{ backgroundColor: 'white' }}
            bordered
          >
            <TaskExecute
              formItemLayout={formItemLayout}
              forminladeLayout={forminladeLayout}
              type={type}
              userinfo={userinfo}
              taskResult={taskResult}
              ref={SaveRef}
            />
          </Panel>
        )}

        {
          (executestatus === '已延期' || executestatus === '计划中') && (
            <Panel
              header='作业计划延期'
              key='1'
              style={{ backgroundColor: 'white' }}
            >
              <OperationPlanfillin
                formItemLayout={formItemLayout}
                forminladeLayout={forminladeLayout}
                executestatus={executestatus}
                type={type}
                userinfo={userinfo}
                ref={SaveRef}
              />
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
  }))(Work)
)