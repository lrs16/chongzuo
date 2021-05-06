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
import User from '@/components/SelectUser/User';
import OperationPlanfillin from './components/OperationPlanfillin';
import { PageHeaderWrapper } from '@ant-design/pro-layout';


function OperationPlanfillintion(props) {
  const pagetitle = props.route.name;
  const {
    form: { getFieldDecorator, resetFields, validateFields },
    match: { params: { id } },
    dispatch,
    userinfo,
    loading,
  } = props;
  const [expand, setExpand] = useState(false);
  const PlanfillinRef = useRef();
  const [paginations, setPaginations] = useState({ current: 1, pageSize: 10 });
  const [selectdata, setSelectData] = useState('');
  const [richtext, setRichtext] = useState('');
  const [files, setFiles] = useState({ arr: [], ischange: false }); // 下载列表
  //  选人组件
  const [uservisible, setUserVisible] = useState(false); // 是否显示选人组件
  const [userchoice, setUserChoice] = useState(false); // 已经选择人员
  const [changorder, setChangeOrder] = useState(undefined);
  let saveData;
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

  // 上传删除附件触发保存
  // useEffect(() => {
  //   if (files.ischange) {
  //     getTobolist();
  //   }
  // }, [files]);

  const queryDept = () => {
    dispatch({
      type: 'itsmuser/fetchuser',
    });
  };

  console.log(richtext, 'richtext')
  useEffect(() => {
    queryDept();
  }, [])

  const saveApi = () => {
    dispatch({
      type: 'processmodel/savesaveForm',
      payload: saveData
    });
  }

  useEffect(() => {
    saveApi();
  }, [userchoice])

    // 表单校验提示信息
    const formerr = () => {
      message.error('请将信息填写完整...');
    };

  //  点击保存触发事件
  const handlesubmit = (params) => {
    PlanfillinRef.current.validateFields((err, values) => {
      if (params?!err:true) {
        saveData = {
          ...values,
          main_addTime: values.main_addTime ? values.main_addTime.format('YYYY-MM-DD HH:mm:ss') : '',
          main_plannedStarTtime: values.main_plannedStarTtime ? values.main_plannedStarTtime.format('YYYY-MM-DD HH:mm:ss') : '',
          main_plannedEndTime: values.main_plannedEndTime ? values.main_plannedEndTime.format('YYYY-MM-DD HH:mm:ss') : '',
          // registerAttachments:files.ischange?JSON.stringify(files.arr):null,
          // importance:Number(values.importance)?values.importance:'001',
          // jumpType,
          // main_mainId: richtext,
          main_content: richtext,
          flowNodeName: '作业计划填报',
          editState: 'add'
        }

        if(params === false) {
          saveApi();
        }

        if(params) {
          setUserVisible(true)
        }
      }

      if(params === true && err) {
        return formerr();
      }
    });
  };

  const handleClose = () => {
    router.push({
      pathname: `/ITSM/operationplan/myoperationplan`,
    });
  }

  const handlePaste = () => {
    if (id === 'no') {
      message.info('请在列表页复制')
    }
  }

  // 上传附件触发保存
  useEffect(() => {
    if (files.ischange) {
      handlesubmit(false);
    }
  }, [files]);




  return (
    <PageHeaderWrapper
      title={pagetitle}
      extra={
        <>
          <Button type="danger" ghost style={{ marginRight: 8 }}>
            删除
           </Button>

          <Button type="primary" style={{ marginRight: 8 }} onClick={handlePaste}>
            粘贴
          </Button>

          <Button type="primary" style={{ marginRight: 8 }} onClick={()=>handlesubmit(false)}>
            保存
          </Button>

          <Button type="primary" style={{ marginRight: 8 }} onClick={()=>handlesubmit(true)}>
            送审
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
          }}
          files={files.arr}
        />

        {/* 选人组件 */}
        <User
          // taskId={id}
          visible={uservisible}
          ChangeUserVisible={v => setUserVisible(v)}
          changorder={changorder}
          ChangeChoice={v => setUserChoice(v)}
          ChangeType={() => 0}
        />
      </Card>

    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ processmodel, itsmuser, loading }) => ({
    userinfo: itsmuser.userinfo,
    loading: loading.models.processmodel,
  }))(OperationPlanfillintion),
);
