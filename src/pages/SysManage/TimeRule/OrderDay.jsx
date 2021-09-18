import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Form, Button, TimePicker, Row, Col, Table, Divider, Popconfirm, Message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from '../style.less';
import TimeTableDrawer from './components/TimeTableDrawer';
import { queryWorkTime, updateWorkTime } from '../services/api';

const format = 'HH:mm';
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 3 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 21 },
  },
};
const fromallItem = {
  labelCol: {
    sm: { span: 24 },
  },
};

function OrderDay(props) {
  const pagetitle = props.route.name;
  const { dispatch, list, listtotal, loading, location } = props;
  const { getFieldDecorator, validateFields } = props.form;
  const [visible, setVisible] = useState(false); // 抽屉是否显示
  const [title, setTitle] = useState('');
  const [savetype, setSaveType] = useState(''); // 保存类型  save:新建  update:编辑
  const [data, setData] = useState('');
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });
  const [worktime, setWorkTime] = useState('');
  const [expand, setExpand] = useState(false);

  const handleShowDrawer = (drwertitle, type, record) => {
    setVisible(!visible);
    setTitle(drwertitle);
    setSaveType(type);
    setData(record);
  };

  const getdatas = () => {
    dispatch({
      type: 'timetable/query',
      payload: {
        pageIndex: paginations.current - 1,
        pageSize: paginations.pageSize,
      },
    });
  };

  useEffect(() => {
    getdatas();
  }, []);


  const searchdata = (values, page, size) => {
    dispatch({
      type: 'timetable/query',
      payload: {
        ...values,
        pageIndex: page - 1,
        pageSize: size,
      },
    });
  };

  const onShowSizeChange = (page, size) => {
    validateFields((err, values) => {
      if (!err) {
        searchdata(values, page, size);
      }
    });
    setPageinations({
      ...paginations,
      pageSize: size,
    });
  };

  const changePage = page => {
    validateFields((err, values) => {
      if (!err) {
        searchdata(values, page, paginations.pageSize);
      }
    });
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
    total: listtotal,
    showTotal: total => `总共  ${total}  条记录`,
    onChange: page => changePage(page),
  };

  // 提交
  const handleSubmit = values => {
    const payloadvalues = {
      type: values.type,
      remark: values.remark,
      actionDate: values.actionDate.format('YYYY-MM-DD 00:00:00'),
      endH: values.endtime.format('HH'),
      endM: values.endtime.format('mm'),
      startH: values.starttime.format('HH'),
      startM: values.starttime.format('mm'),
    }
    if (savetype === 'save') {
      dispatch({
        type: 'timetable/save',
        payload: {
          ...payloadvalues
        },
      }).then(res => {
        Message.success(res.msg);
        if (res.code === 200) {
          getdatas();
        }
      });
    }
    if (savetype === 'update') {
      dispatch({
        type: 'timetable/update',
        payload: {
          id: values.id,
          ...payloadvalues,
        },
      }).then(res => {
        Message.success(res.msg);
        if (res.code === 200) {
          getdatas();
        }
      });
    }
  };

  // 删除
  const handleDelete = ids => {
    dispatch({
      type: 'timetable/delete',
      payload: { ids },
    }).then(res => {
      Message.success(res.msg);
      if (res.code === 200) {
        getdatas();
      }
    });
  };

  const queryworktime = () => {
    queryWorkTime().then(res => {
      if (res.code === 200) {
        const am = res.data.filter(item => item.id === '1');
        const pm = res.data.filter(item => item.id === '2');
        const ams = `${am[0].startH}:${am[0].startM}`;
        const ame = `${am[0].endH}:${am[0].endM}`;
        const pms = `${pm[0].startH}:${pm[0].startM}`;
        const pme = `${pm[0].endH}:${pm[0].endM}`;
        setWorkTime({ ams, ame, pms, pme });
      }
    })
  }

  // 查询上班时间
  useEffect(() => {
    queryworktime()
  }, []);

  // 调整上班时间
  const changeWorkTime = () => {
    validateFields((err, values) => {
      const AMStartH = values.amstart.format('HH');
      const AMStartM = values.amstart.format('mm');
      const AMEndH = values.amend.format('HH');
      const AMEndM = values.amend.format('mm');
      const PMStartH = values.pmstart.format('HH');
      const PMStartM = values.pmstart.format('mm');
      const PMEndH = values.pmend.format('HH');
      const PMEndM = values.pmend.format('mm');
      if (!err) {
        updateWorkTime({ AMStartH, AMStartM, AMEndH, AMEndM, PMStartH, PMStartM, PMEndH, PMEndM }).then(res => {
          if (res.code === 200) {
            Message.success(res.msg);
            queryworktime()
          }
        })
      }
    })

  };

  // 重置
  const handleReset = () => {
    router.push({
      pathname: `/sysmanage/timerule/orderday`,
      state: { cach: false, }
    });
    dispatch({
      type: 'timetable/query',
      payload: {
        pageIndex: 0,
        pageSize: 15,
      },
    });
    queryworktime();
    setPageinations({ current: 1, pageSize: 15 });
  };

  useEffect(() => {
    if (location.state && location.state.reset) {
      // 点击菜单刷新
      handleReset()
    }
  }, [location.state]);

  const columns = [
    {
      title: '生效日期',
      dataIndex: 'actionDate',
      key: 'actionDate',
      render: text => {
        return <>{moment(text).format('YYYY-MM-DD')}</>;
      },
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: text => {
        const textmaps = new Map([
          ['W', '工作'],
          ['R', '休息'],
          ['N', '工作时间段记录'],
        ]);
        return <>{textmaps.get(text)}</>;
      },
    },
    {
      title: '开始时间',
      dataIndex: 'start',
      key: 'start',
      render: (_, record) => {
        const sm = record.startM.length > 1 ? record.startM : `0${record.startM}`;
        return <>{record.startH}:{sm}</>;
      },
    },
    {
      title: '结束时间',
      dataIndex: 'end',
      key: 'end',
      render: (_, record) => {
        const em = record.endM.length > 1 ? record.endM : `0${record.endM}`;
        return <>{record.endH}:{em}</>;
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      fixed: 'right',
      width: 150,
      render: (text, record) => {
        return (
          <div>
            <a type="link" onClick={() => handleShowDrawer('编辑工作日程', 'update', record)}>
              编辑
            </a>
            <Divider type="vertical" />
            <Popconfirm title="确定删除该超时规则吗？" onConfirm={() => handleDelete(record.id)}>
              <a type="link">删除</a>
            </Popconfirm>
          </div>
        );
      },
    },
  ];

  return (
    <PageHeaderWrapper title={pagetitle}>
      <div className={styles.orderdaycardbody}>
        <Card style={{ paddingBottom: 0 }}>
          <Form {...formItemLayout}>
            {(!location.state || (location.state && !location.state.reset)) && (
              <Row>
                <Col span={2}>
                  <Form.Item label="上班时间" {...fromallItem} />
                </Col>
                <Col span={9}>
                  <Form.Item label="上午">
                    {getFieldDecorator('amstart', {
                      initialValue: moment(worktime.ams, 'HH:mm'),
                    })(<TimePicker format={format} minuteStep={10} />)}
                    <span style={{ padding: '0 12px' }}>--</span>
                    {getFieldDecorator('amend', {
                      initialValue: moment(worktime.ame, 'HH:mm'),
                    })(<TimePicker format={format} minuteStep={10} />)}
                  </Form.Item>
                </Col>
                <Col span={9}>
                  <Form.Item label="下午">
                    {getFieldDecorator('pmstart', {
                      initialValue: moment(worktime.pms, 'HH:mm'),
                    })(<TimePicker format={format} minuteStep={10} />)}
                    <span style={{ padding: '0 12px' }}>--</span>
                    {getFieldDecorator('pmend', {
                      initialValue: moment(worktime.pme, 'HH:mm'),
                    })(<TimePicker format={format} minuteStep={10} />)}
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <Button type='primary' style={{ marginTop: 4 }} onClick={changeWorkTime}>调整上班时间</Button>
                </Col>
              </Row>
            )}
          </Form>
        </Card>
      </div>
      <Card style={{ marginTop: 24, }}>
        <h3>例外设置</h3>
        <Button
          style={{ width: '100%', }}
          type="dashed"
          icon="plus"
          onClick={() => handleShowDrawer('新建例外设置', 'save')}
        >
          新增例外设置
        </Button>
        <Table
          style={{ background: '#fff' }}
          columns={columns}
          dataSource={list}
          loading={loading}
          rowKey={(_, index) => index.toString()}
          pagination={pagination}
        />
      </Card>
      <TimeTableDrawer
        visible={visible}
        ChangeVisible={v => setVisible(v)}
        title={title}
        handleSubmit={v => handleSubmit(v)}
        record={data}
        destroyOnClose
      />

    </PageHeaderWrapper>
  );
}

export default Form.create()(
  connect(({ timetable, loading }) => ({
    list: timetable.list,
    total: timetable.total,
    loading: loading.models.timetable,
  }))(OrderDay)
);
