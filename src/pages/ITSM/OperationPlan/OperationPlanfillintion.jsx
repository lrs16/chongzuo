import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'dva';
import { Form, Card, Button, message, Collapse } from 'antd';
import router from 'umi/router';
import HadleContext from '@/layouts/MenuContext';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import OperationPlanfillin from './components/OperationPlanfillin';

import styles from './index.less';

const { Panel } = Collapse;
function OperationPlanfillintion(props) {
  const pagetitle = props.route.name;
  const {
    location,
    dispatch,
    userinfo,
    operationPersonArr,
    tabdata,
    loading,
  } = props;
  let operationPersonSelect;

  const PlanfillinRef = useRef();
  const [files, setFiles] = useState({ arr: [], ischange: false }); // 下载列表
  const [copyData, setCopyData] = useState('');
  const [uploadStatus, setUploadStatus] = useState(false);
  const [handleUploadStatus, setHandleUploadStatus] = useState(false);

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

  const queryDept = () => {
    dispatch({
      type: 'itsmuser/fetchuser',
    });
  };

  //  获取作业负责人
  const getoperationPerson = () => {
    dispatch({
      type: 'processmodel/operationPerson',
    });
  };

  // 处理作业负责人数据
  if (operationPersonArr.length) {
    operationPersonSelect = operationPersonArr.map(item => {
      return {
        key: item.id,
        value: item.userName,
      };
    });
  }

  useEffect(() => {
    queryDept();
    getoperationPerson();
  }, []);

  //  点击保存触发事件
  const handlesubmit = () => {
    const values = PlanfillinRef.current.getFieldsValue();
    if (!values.main_operationUser) {
      message.info('保存前请先选择作业负责人');
      return false;
    }
    if ((values.main_plannedStartTime).valueOf() > (values.main_plannedEndTime).valueOf()) {
      message.error('计划开始时间必须小于计划结束时间')
    } else {
      dispatch({
        type: 'processmodel/saveallForm',
        payload: {
          ...values,
          main_addTime: values.main_addTime
            ? values.main_addTime.format('YYYY-MM-DD HH:mm:ss')
            : '',
          main_plannedStartTime: values.main_plannedStartTime
            ? values.main_plannedStartTime.format('YYYY-MM-DD HH:mm:ss')
            : '',
          main_plannedEndTime: values.main_plannedEndTime
            ? values.main_plannedEndTime.format('YYYY-MM-DD HH:mm:ss')
            : '',
          main_fileIds: JSON.stringify(files.arr),
          main_object: values.main_object || '',
          main_content: values.main_content || '',
          main_riskAnalysis: values.main_riskAnalysis || '',
          main_riskMeasures: values.main_riskMeasures || '',
          flowNodeName: '计划登记',
          editState: 'add',
          main_id: '',
          main_status: '1',
          main_addUserId: userinfo.userId,
          main_addUnitId: userinfo.unitId,
          main_addUser: userinfo.userName,
        },
      });
    }
  };

  // 上传删除附件触发保存
  useEffect(() => {
    if (files.ischange && !handleUploadStatus) {
      handlesubmit(true);
    }
  }, [files]);

  const handleClose = () => {
    router.push({
      pathname: `/ITSM/operationplan/operationplanfillin`,
      query: { tabid: sessionStorage.getItem('tabid'), closecurrent: true }
    });
  };

  const handlePaste = () => {
    const copyobj = JSON.parse(localStorage.getItem('copy'));
    if (!copyobj) {
      message.info('请在列表页复制一条数据进行粘贴哦');
      return false;
    }
    setCopyData(copyobj)
    return []
  };

  // 获取页签信息
  useEffect(() => {
    if (location.state) {
      if (location.state.cache) {
        if (uploadStatus || handleUploadStatus) {
          setUploadStatus(false);
          setHandleUploadStatus(false);
        };
        if (uploadStatus) { message.info('页签切换，中止文件上传...') }
        PlanfillinRef.current.validateFields((_, values) => {
          dispatch({
            type: 'viewcache/gettabstate',
            payload: {
              cacheinfo: {
                systemName: values.main_systemName,
                type: values.main_type,
                nature: values.main_nature,
                operationUnit: values.main_operationUnit,
                operationUser: values.main_operationUser,
                billing: values.main_billing,
                object: values.main_object,
                content: values.main_content,
                plannedStartTime: values.main_plannedStartTime.format('YYYY-MM-DD HH:mm:ss'),
                plannedEndTime: values.main_plannedEndTime.format('YYYY-MM-DD HH:mm:ss'),
                addTime: values.main_addTime.format('YYYY-MM-DD HH:mm:ss'),
              },
              tabid: sessionStorage.getItem('tabid'),
            },
          });
        });
        PlanfillinRef.current.resetFields();
      }
    }
  }, [location]);

  useEffect(() => {
    if (tabdata !== undefined) {
      setCopyData(tabdata);
    }
  }, [tabdata]);

  return (
    <PageHeaderWrapper
      title={pagetitle}
      extra={
        <>
          <Button
            type="primary"
            style={{ marginRight: 8 }}
            onClick={() => handlePaste()}
            disabled={uploadStatus || handleUploadStatus || loading}
          >
            粘贴
          </Button>

          <Button
            type="primary"
            style={{ marginRight: 8 }}
            onClick={() => handlesubmit(false)}
            disabled={uploadStatus || handleUploadStatus || loading}
          >
            保存
          </Button>

          <Button onClick={() => handleClose()}>关闭</Button>
        </>
      }
    >

      <div className='noexplain'>
        <div className={styles.collapse}>
          <Collapse
            expandIconPosition="right"
            defaultActiveKey={['1']}
          // bordered={false}
          >
            <Panel header='计划登记' key="1">
              <HadleContext.Provider value={{
                handleUploadStatus,
                getUploadStatus: (v) => { setHandleUploadStatus(v) },
                getRegistUploadStatus: (v) => { setUploadStatus(v) }
              }}>
                <OperationPlanfillin
                  ref={PlanfillinRef}
                  useInfo={userinfo}
                  formItemLayout={formItemLayout}
                  forminladeLayout={forminladeLayout}
                  ChangeFiles={newvalue => {
                    setFiles(newvalue);
                  }}
                  files={[]}
                  loading={loading}
                  getUploadStatus={v => { setUploadStatus(v) }}
                  operationPersonSelect={operationPersonSelect}
                  main={copyData}
                />
              </HadleContext.Provider>
            </Panel>

          </Collapse>
        </div>
      </div>



    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ processmodel, itsmuser, viewcache, loading }) => ({
    userinfo: itsmuser.userinfo,
    operationPersonArr: processmodel.operationPersonArr,
    loading: loading.models.processmodel,
    tabnew: viewcache.tabnew,
    tabdata: viewcache.tabdata,
  }))(OperationPlanfillintion),
);
