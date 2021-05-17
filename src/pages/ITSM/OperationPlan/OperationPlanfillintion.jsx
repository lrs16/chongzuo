import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import {
  Form,
  Card,
  Input,
  Button,
  message,
} from 'antd';
import router from 'umi/router';
import OperationPlanfillin from './components/OperationPlanfillin';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

let copyData;
function OperationPlanfillintion(props) {
  const pagetitle = props.route.name;
  const {
    location: { query: { mainId } },
    dispatch,
    userinfo,
    loading,
    openFlowList,
    operationPersonArr
  } = props;

  let operationPersonSelect;

  const PlanfillinRef = useRef();
  const [richtext, setRichtext] = useState('');
  const [files, setFiles] = useState({ arr: [], ischange: false }); // 下载列表
  const [test, setTest] = useState({ arr: [], ischange: false }); // 下载列表
  
  console.log(files,'files')


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

  const testFunction = (newvalue) => {
    console.log(1);
    console.log(newvalue)
  }


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
  }

  // 处理作业负责人数据
  if (operationPersonArr.length) {
    operationPersonSelect = operationPersonArr.map(item => {
      return {
        key: item.id,
        value: item.userName
      }
    })
  }

  useEffect(() => {
    copyData = '';
    queryDept();
    getoperationPerson();
  }, [])

  //  点击保存触发事件
  const handlesubmit = (params) => {
    PlanfillinRef.current.validateFields((err, values) => {
      if (params?true:!err) {
        dispatch({
          type: 'processmodel/saveallForm',
          payload: {
            ...values,
            main_addTime: values.main_addTime ? values.main_addTime.format('YYYY-MM-DD HH:mm:ss') : '',
            main_plannedStartTime: values.main_plannedStartTime ? values.main_plannedStartTime.format('YYYY-MM-DD HH:mm:ss') : '',
            main_plannedEndTime: values.main_plannedEndTime ? values.main_plannedEndTime.format('YYYY-MM-DD HH:mm:ss') : '',
            main_fileIds: files.ischange ? JSON.stringify(files.arr) : null,
            flowNodeName: '计划登记',
            editState: 'add',
            main_id: '',
            main_status: '1',
            main_addUserId: userinfo.userId,
            main_addUnitId: userinfo.unitId,
            main_addUser: userinfo.userName
          }
        })
      }
    });
  };

  // 上传删除附件触发保存
  // useEffect(() => {
  //   if (files.ischange) {
  //     handlesubmit(true);
  //   }
  // }, [files]);

  const handleClose = () => {
    router.push({
      pathname: `/ITSM/operationplan/myoperationplan`,
    });
  }

  const handlePaste = () => {
    if (!mainId) {
      message.info('请在列表页复制');
      return false
    }
    if(mainId.length >1) {
      message.info('只能复制一条数据粘贴哦');
      return false
    }

    dispatch({
      type: 'processmodel/openFlow',
      payload: mainId
    })

    if (mainId[0]) {
      copyData = openFlowList;
      delete copyData.main.operationNo
    }


  }


  return (
    <PageHeaderWrapper
      title={pagetitle}
      extra={
        <>

          <Button type="primary" style={{ marginRight: 8 }} onClick={handlePaste}>
            粘贴
          </Button>

          <Button type="primary" style={{ marginRight: 8 }} onClick={() => handlesubmit(false)}>
            保存
          </Button>


          <Button onClick={handleClose}>关闭</Button>
        </>
      }
    >

      <Card>
          <OperationPlanfillin
            ref={PlanfillinRef}
            useInfo={userinfo}
            formItemLayout={formItemLayout}
            forminladeLayout={forminladeLayout}
            getRichtext={(richText => setRichtext(richText))}
            ChangeFiles={newvalue => {
              setFiles(newvalue);
              testFunction(newvalue);
            }}
            files={[]}
            operationPersonSelect={operationPersonSelect}
            main={copyData ? copyData.main : {}}
          />


      </Card>

    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ processmodel, itsmuser, loading }) => ({
    userinfo: itsmuser.userinfo,
    openFlowList: processmodel.openFlowList,
    operationPersonArr: processmodel.operationPersonArr,
    loading: loading.models.processmodel,
  }))(OperationPlanfillintion),
);
