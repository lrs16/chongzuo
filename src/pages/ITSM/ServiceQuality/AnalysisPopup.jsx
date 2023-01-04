import React, { useEffect, useState } from 'react';
import {
  Drawer,
  Form,
  Button,
  Table,
  Tooltip,
  Icon
} from 'antd';
import moment from 'moment';
import router from 'umi/router';
import { connect } from 'dva';

function AnalysisPopup(props) {
  const {
    title,
    popupParameters,
    dispatch,
    visible,
    closePop,
    tobeDealtarr,
    loading
  } = props;

  const [paginations, setPageinations] = useState({ current: 1, pageSize: 10 });

  const searchdata = (values, pageNum, pageSize) => {
    dispatch({
      type: 'performanceappraisal/assessSearch',
      payload: {
        ...values,
        assessBeginTime: values.assessBeginTime? moment(values.assessBeginTime).format('YYYY-MM-DD 00:00:00'):'',
        assessEndTime: values.assessEndTime ? moment(values.assessEndTime).format('YYYY-MM-DD 23:59:59'):'',
        pageNum,
        pageSize,
      },
    });
  }

  const todetail = record => {
    router.push({
      pathname:
        '/ITSM/servicequalityassessment/serviceperformanceappraisal/tobedealtform',
      query: {
        assessNo: record.assessNo,
        mainId: record.instanceId,
        taskId: record.currentTaskId,
        instanceId: record.instanceId,
        taskName: record.currentTaskName,
        orderNo: record.assessNo,
        search: true,
      },
    });
  };



  const column = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      width: 100,
      render: (text, record, index) =>
        `${(paginations.current - 1) * paginations.pageSize + (index + 1)}`,
    },
    {
      title: '服务绩效编号',
      dataIndex: 'assessNo',
      key: 'assessNo',
      width: 200,
      fixed: 'left',
      render: (text, record) => {
        return <a onClick={() => todetail(record)}>{text}</a>;
      },
    },
    {
      title: '服务商',
      dataIndex: 'providerName',
      key: 'providerName',
      width: 150,
    },
    {
      title: '责任人',
      dataIndex: 'directorName',
      key: 'directorName',
      width: 150,
    },
    {
      title: '考核内容说明',
      dataIndex: 'assessContent',
      key: 'assessContent',
      width: 150,
      ellipsis: true,
      render: text => {
        return (
          <Tooltip placement="topLeft" title={text}>
            <span>{text}</span>
          </Tooltip>
        );
      },
    },
    {
      title: '考核类型',
      dataIndex: 'assessType',
      key: 'assessType',
      width: 150,
    },
    {
      title: '考核对象',
      dataIndex: 'assessObject',
      key: 'assessObject',
      width: 150,
    },
    {
      title: '一级指标',
      dataIndex: 'target1Name',
      key: 'target1Name',
      width: 150,
    },
    {
      title: '二级指标',
      dataIndex: 'target2Name',
      key: 'target2Name',
      width: 150,
    },
    {
      title: '详细条款',
      dataIndex: 'clauseName',
      key: 'clauseName',
      width: 150,
      ellipsis: true,
      render: text => {
        return (
          <Tooltip title={text} placement="topLeft">
            <span>{text}</span>
          </Tooltip>
        );
      },
    },
    {
      title: '发生时间',
      dataIndex: 'assessTime',
      key: 'assessTime',
      width: 200,
    },
    {
      title: '考核得分',
      dataIndex: 'assessValue',
      key: 'assessValue',
      width: 150,
    },
    {
      title: '当前处理环节',
      dataIndex: 'currentTaskName',
      key: 'currentTaskName',
      width: 150,
    },
    // {
    //   title: '当前环节处理人',
    //   dataIndex: 'assignee',
    //   key: 'assignee',
    //   width: 150,
    // },
    {
      title: '关联合同名称',
      dataIndex: 'contractName',
      key: 'contractName',
      width: 150,
      ellipsis: true,
      render: text => {
        return (
          <Tooltip title={text} placement="topLeft">
            <span>{text}</span>
          </Tooltip>
        );
      },
    },
    {
      title: '考核状态',
      dataIndex: 'assessStatus',
      key: 'assessStatus',
      width: 150,
    },
    {
      title: '登记人',
      dataIndex: 'register',
      key: 'register',
      width: 150,
    },
    {
      title: '登记时间',
      dataIndex: 'applyTime',
      key: 'applyTime',
      width: 200,
    },
    {
      title: '业务负责人审核结果',
      dataIndex: 'directorVerifyValue',
      key: 'directorVerifyValue',
      width: 180,
    },
    {
      title: '业务负责人审核说明',
      dataIndex: 'directorVerifyContent',
      key: 'directorVerifyContent',
      width: 180,
      ellipsis: true,
      render: text => {
        return (
          <Tooltip placement="topLeft" title={text}>
            <span>{text}</span>
          </Tooltip>
        );
      },
    },
    {
      title: '业务负责人审核状态',
      dataIndex: 'directorVerifyStatus',
      key: 'directorVerifyStatus',
      width: 180,
    },
    {
      title: '业务负责人审核人',
      dataIndex: 'directorVerifierName',
      key: 'directorVerifierName',
      width: 180,
    },
    {
      title: '业务负责人审核时间',
      dataIndex: 'directorVerifyTime',
      key: 'directorVerifyTime',
      width: 200,
    },
    {
      title: '是否申诉',
      dataIndex: 'isAppeal',
      key: 'isAppeal',
      width: 150,
    },
    {
      title: '申诉内容',
      dataIndex: 'appealContent',
      key: 'appealContent',
      width: 150,
      ellipsis: true,
      render: text => {
        return (
          <Tooltip title={text} placement="topLeft">
            <span>{text}</span>
          </Tooltip>
        );
      },
    },
    {
      title: '服务商确认人',
      dataIndex: 'providerConfirmerName',
      key: 'providerConfirmerName',
      width: 150,
    },
    {
      title: '服务商确认时间',
      dataIndex: 'providerConfirmTime',
      key: 'providerConfirmTime',
      width: 200,
    },
    {
      title: '自动化科复核结果',
      dataIndex: 'directorReviewValue',
      key: 'directorReviewValue',
      width: 180,
    },
    {
      title: '自动化科复核说明',
      dataIndex: 'directorReviewContent',
      key: 'directorReviewContent',
      width: 180,
      ellipsis: true,
      render: text => {
        return (
          <Tooltip title={text} placement="topLeft">
            <span>{text}</span>
          </Tooltip>
        );
      },
    },
    {
      title: '自动化科复核人',
      dataIndex: 'directorReviewerName',
      key: 'directorReviewerName',
      width: 180,
    },
    {
      title: '自动化科复核时间',
      dataIndex: 'directorReviewTime',
      key: 'directorReviewTime',
      width: 200,
    },
    {
      title: '服务绩效考核确认结果',
      dataIndex: 'finallyConfirmValue',
      key: 'finallyConfirmValue',
      width: 180,
    },
    {
      title: '服务绩效考核确认说明',
      dataIndex: 'finallyConfirmContent',
      key: 'finallyConfirmContent',
      width: 180,
      ellipsis: true,
      render: text => {
        return (
          <Tooltip title={text} placement="topLeft">
            <span>{text}</span>
          </Tooltip>
        );
      },
    },
    {
      title: '服务绩效考核确认人',
      dataIndex: 'finallyConfirmerName',
      key: 'finallyConfirmerName',
      width: 180,
    },
    {
      title: '服务绩效考核确认时间',
      dataIndex: 'finallyConfirmTime',
      key: 'finallyConfirmTime',
      width: 200,
    },
    {
      title: '考核来源',
      dataIndex: 'source',
      key: 'source',
      width: 200,
    },
  ];

  useEffect(() => {
    if (visible && popupParameters) {
      searchdata(popupParameters, 1, 10)
    }
  }, [visible, popupParameters])

  const onShowSizeChange = (page, size) => {
    searchdata(popupParameters, paginations.current, size)
    setPageinations({
      ...paginations,
      pageSize: size,
    });
  };

  const changePage = page => {
    searchdata(popupParameters, page, paginations.pageSize)
    setPageinations({
      ...paginations,
      current: page,
    });
  };

  const pagination = {
    showSizeChanger: true,
    onShowSizeChange: (page, size) => onShowSizeChange(page, size),
    current: paginations.current,
    pageSize: paginations.pageSize,
    total: tobeDealtarr.total,
    showTotal: total => `总共  ${total}  条记录`,
    onChange: page => changePage(page),
  };

  const handleCancel = () => {
    closePop();
    setPageinations({
      current: 1,
      pageSize: 10
    })
  }

  //  下载
  const download = () => {
    dispatch({
      type: 'performanceappraisal/exportSearch',
      payload: {
        ...popupParameters,
        assessBeginTime: popupParameters.assessBeginTime? moment(popupParameters.assessBeginTime).format('YYYY-MM-DD 00:00:00'):'',
        assessEndTime: popupParameters.assessEndTime ? moment(popupParameters.assessEndTime).format('YYYY-MM-DD 23:59:59'):'',
      },
    }).then(res => {
      const filename = `统计查询钻取.xls`;
      const blob = new Blob([res]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  return (
    <>
      <Drawer
        title={title}
        visible={visible}
        width={1000}
        centered
        maskClosable
        onClose={handleCancel}
        destroyOnClose='true'
      >
        <Button
          type="primary"
          onClick={() => download()}
          style={{ marginBottom: 10 }}>
          导出数据
        </Button>

        <Table
          loading={loading}
          columns={column}
          dataSource={tobeDealtarr.records}
          pagination={pagination}
          scroll={{ x: true }}
          rowKey={(record,index)=>{return index}}
        />
      </Drawer>
    </>
  )
}

export default Form.create({})(
  connect(({ performanceappraisal, loading }) => ({
    tobeDealtarr: performanceappraisal.tobeDealtarr,
    loading: loading.models.performanceappraisal,
  }))(AnalysisPopup)
)
