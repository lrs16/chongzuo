import React, { useEffect, useState, createContext, useRef } from 'react';
import router from 'umi/router';
import { Form, Button, Card } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import Registrat from './components/Registrat';

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

export const RegistratContext = createContext();

function Registration(props) {
  const pagetitle = props.route.name;
  const {
    dispatch,
    list,
    keyVallist,
    typelist,
    prioritylist,
    scopeList,
    projectList,
    userinfo,
    antoArr,
  } = props;
  const [files, setFiles] = useState({ arr: [], ischange: false }); // 下载列表
  const RegistratRef = useRef();

  const getSourceapi = (dictModule, dictType) => {
    dispatch({
      type: 'problemdropdown/keyvalsource',
      payload: { dictModule, dictType },
    });
  };
  //  问题来源
  const getSource = () => {
    const dictModule = 'problem';
    const dictType = 'source';
    getSourceapi(dictModule, dictType);
  };
  //  问题分类
  const gettype = () => {
    const dictModule = 'problem';
    const dictType = 'type';
    getSourceapi(dictModule, dictType);
  };
  //  重要程度
  const getpriority = () => {
    const dictModule = 'public';
    const dictType = 'priority';
    getSourceapi(dictModule, dictType);
  };
  //  影响范围
  const getscope = () => {
    const dictModule = 'public';
    const dictType = 'effect';
    getSourceapi(dictModule, dictType);
  };

  // 所属项目
  const getProject = () => {
    const dictModule = 'public';
    const dictType = 'project';
    getSourceapi(dictModule, dictType);
  };

  const queryDept = () => {
    dispatch({
      type: 'itsmuser/fetchuser',
    });
  };

  useEffect(() => {
    getSource();
    gettype();
    getpriority();
    getscope();
    getProject();
    queryDept();
  }, []);

  //  点击保存触发事件
  const handlesubmit = () => {
    RegistratRef.current.validateFields((_, values) => {
      dispatch({
        type: 'problemmanage/getAddid',
        payload: {
          ...values,
          registerTime: values.registerTime.format('YYYY-MM-DD HH:mm:ss'),
          registerOccurTime: values.registerOccurTime.format('YYYY-MM-DD HH:mm:ss'),
          registerExpectTime: values.registerExpectTime.format('YYYY-MM-DD HH:mm:ss'),
          registerAttachments: files.ischange ? JSON.stringify(files.arr) : null,
          importance: Number(values.importance) ? values.importance : '001',
          editState: 'add'
        },
      });
    });
  };

  const handleCirculation = () => {
    handlesubmit(0);
  };

  const handClose = () => {
    router.push({
      pathname: `/ITSM/problemmanage/registration`,
      query: { tabid: sessionStorage.getItem('tabid'), closecurrent: true, }
    });
  };

  // 上传附件触发保存
  useEffect(() => {
    if (files.ischange) {
      handlesubmit(0);
    }
  }, [files]);

  // 初始化清空附件元素
  useEffect(() => {
    files.arr = [];
  }, []);

  return (
    <PageHeaderWrapper
      title={pagetitle}
      extra={
        <>
          <Button type="primary" style={{ marginRight: 8 }} onClick={handleCirculation}>
            保 存
          </Button>
          <Button type="default" onClick={() => handClose()}>
            关 闭
          </Button>
        </>
      }
    >
      <Card>
        <RegistratContext.Provider>
          <Registrat
            formItemLayout={formItemLayout}
            forminladeLayout={forminladeLayout}
            ref={RegistratRef}
            list={list}
            useInfo={userinfo}
            files={files.arr}
            ChangeFiles={newvalue => {
              setFiles(newvalue);
            }}
            source={keyVallist.source}
            type={typelist.type}
            priority={prioritylist.priority}
            scope={scopeList.effect}
            project={projectList.project}
            antoArr={antoArr}
          />
        </RegistratContext.Provider>
      </Card>
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ problemmanage, demandtodo, problemdropdown, itsmuser, loading }) => ({
    list: problemmanage.list,
    id: problemmanage.id,
    newno: problemmanage.newno,
    // useInfo: problemmanage.useInfo,
    info: demandtodo.info,
    keyVallist: problemdropdown.keyVallist,
    typelist: problemdropdown.typelist,
    prioritylist: problemdropdown.prioritylist,
    scopeList: problemdropdown.scopeList,
    projectList: problemdropdown.projectList,
    userinfo: itsmuser.userinfo,
    startid: problemmanage.startid,
    loading: loading.models.problemmanage,
  }))(Registration),
);
