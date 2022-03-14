import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import { Card, Row, Col, Form, DatePicker, Select, Button, Table, Popover, Tooltip, Tag, Radio, Icon } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import DictLower from '@/components/SysDict/DictLower';
import TableColumns from '@/components/TableColumns';
import { querkeyVal } from '@/services/api';

const { Option } = Select;
const { CheckableTag } = Tag;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const tagsFromServer = ['按日', '按月', '按年'];

const modemap = new Map([
  ['按日', 'date'],
  ['按月', 'month'],
  ['按年', 'year'],
]);

const formatmap = new Map([
  ['按日', 'YYYY-MM-DD'],
  ['按月', 'YYYY-MM'],
  ['按年', 'YYYY'],
])

function Statistics(props) {
  const pagetitle = props.route.name;
  const {
    dispatch, location,
    form: { getFieldDecorator, resetFields, getFieldsValue, }, loading,
    successratelist, tasksumlist,
  } = props;
  const [tabActivekey, settabActivekey] = useState('successrate'); // 打开标签
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 15 });
  const [selectdata, setSelectData] = useState('');
  const [tabColumns, setColumns] = useState('');
  const [defaultColumns, setDefaultColumns] = useState([]);
  const [defaultColRecord, setDefaultColRecord] = useState({ success: undefined, fail: undefined });
  const [selectTag, setSelectTag] = useState('按日');
  const [visible, setVisible] = useState(false);
  const [dateOpen, setDateOpen] = useState({ start: false, end: false });
  const [startdates, setStartDates] = useState(undefined);
  const [enddates, setEndDates] = useState(undefined);

  const handleSearch = (pageIndex, pageSize) => {
    const values = getFieldsValue();
    const val = {
      ...values,
      beginTime: startdates ? moment(startdates).format('YYYY-MM-DD HH:mm:ss') : '',
      endTime: enddates ? moment(enddates).format('YYYY-MM-DD HH:mm:ss') : '',
      pageIndex,
      pageSize,
    }
    if (tabActivekey === 'successrate') {
      dispatch({
        type: 'releasestatistics/fetchsuccessrate',
        payload: {
          ...val
        },
      });
    };
    if (tabActivekey === 'process') {
      dispatch({
        type: 'releasestatistics/fetchtasksum',
        payload: {
          ...val
        },
      });
    }
  };

  const handleReset = () => {
    resetFields();
    handleSearch(1, 15);
  }

  const handleChang = (tag, checked) => {
    if (checked) {
      setSelectTag(tag);
      setStartDates(undefined);
      setEndDates(undefined);
    };
    // handleSearch(1, 15)
  }

  useEffect(() => {
    if (location.state && location.state.reset) {
      // 点击菜单刷新
      settabActivekey('successrate');
      handleReset();
    }
  }, [location.state]);

  useEffect(() => {
    querkeyVal('release', 'successrate').then(res => {
      if (res.code === 200) {
        setColumns(res.data.successrate);
      }
    });
    querkeyVal('release', 'indexsuccessrate').then(res => {
      if (res.code === 200) {
        setDefaultColumns(res.data.indexsuccessrate)
        querkeyVal('release', 'indexfailrate').then(resfail => {
          if (res.code === 200) {
            setDefaultColRecord({ ...defaultColRecord, success: res.data.indexsuccessrate, fail: resfail.data.indexfailrate })
          }
        })
      }
    });

  }, []);

  useEffect(() => {
    handleSearch(1, 15)
  }, [tabActivekey]);

  const handleTabChange = key => {
    settabActivekey(key);
    resetFields();
    setSelectTag('按日');
    setStartDates(undefined);
    setEndDates(undefined);
    setDateOpen({ start: false, end: false });
  };
  const tabList = [
    {
      key: 'successrate',
      tab: '发布成功率统计',
    },
    {
      key: 'process',
      tab: '发布环节统计',
    },
  ];

  const onShowSizeChange = (page, size) => {
    handleSearch(1, size);
    setPageinations({
      ...paginations,
      current: 1,
      pageSize: size,
    });
  };

  const changePage = page => {
    handleSearch(page, paginations.pageSize);
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
    total: successratelist?.total || tasksumlist?.total || 0,
    showTotal: total => `总共  ${total}  条记录`,
    onChange: page => changePage(page),
  };

  const getTypebyId = key => {
    if (selectdata.ischange) {
      return selectdata.arr.filter(item => item.key === key)[0]?.children;
    }
    return [];
  };

  const typemap = getTypebyId(460);       // 发布类型
  const unitmap = getTypebyId(1052);       // 责任单位

  // 发布成功率表头
  const tableColumns = (tablecolumns) => {
    const newArr = [];
    if (!Array.isArray(tablecolumns)) {
      return newArr;
    }
    for (let i = 0; i < tablecolumns.length; i += 1) {
      const vote = {};
      vote.title = tablecolumns[i].val;
      vote.dataIndex = tablecolumns[i].key;
      vote.key = tablecolumns[i].key;
      vote.width = 150;
      vote.align = 'center';
      newArr.push(vote);
    };
    return newArr;
  };

  // 发布环节统计表头
  const columns = [
    {
      title: '环节名称',
      dataIndex: 'taskName',
      key: 'taskName',
      width: 300
    },
    {
      title: '工单数',
      dataIndex: 'count',
      key: 'count',
      render: (text, record) => {
        const handleClick = () => {
          const values = getFieldsValue();
          const val = {
            ...values,
            beginTime: startdates ? moment(startdates).format('X') : '',
            endTime: enddates ? moment(enddates).format('X') : '',
            releaseStatus: record.taskName === '合计' ? '' : record.taskName,
            paginations: { current: 1, pageSize: 15 },
            expand: true
          };
          if (values.releaseType === '计划发布') {
            router.push({
              pathname: `/ITSM/releasemanage/plan/query`,
              query: { pathpush: true },
              state: { cach: false, cacheinfo: val }
            });
          };
          if (values.releaseType === '临时发布') {
            router.push({
              pathname: `/ITSM/releasemanage/temporary/list`,
              query: { pathpush: true },
              state: {
                cach: false,
                cacheinfo: {
                  ...val,
                  taskName: record.taskName === '合计' ? '' : record.taskName,
                }
              }
            });
          }
        };
        return (<a onClick={handleClick}>{text}</a>);
      },
    },
  ];

  const content = (
    <div style={{ width: 750, height: 400, overflow: 'scroll' }}>
      <TableColumns defaultVal={defaultColumns} records={tabColumns} ChangeSelectVal={v => setDefaultColumns(v)} />
    </div>
  );

  const disastartbledDate = (current) => {
    return current && enddates && current > moment();
  }
  const disaendbledDate = (current) => {
    return current && current < moment() && startdates && current < startdates;
  }

  setTimeout(() => {
    const yeartext = document.getElementsByClassName('ant-calendar-month-panel-year-select-content')[0]?.innerHTML;
    if (enddates && dateOpen.start) {
      if (selectTag === '按月') {
        const monthtrs = document.getElementsByClassName('ant-calendar-month-panel-tbody')[0]?.getElementsByTagName('td')
        const disablemonths = moment(enddates).format('M');
        if (monthtrs && monthtrs.length) {
          if (moment(enddates).format('YYYY') <= moment(yeartext).format('YYYY')) {
            for (let i = moment(enddates).format('YYYY') === moment(yeartext).format('YYYY') ? Number(disablemonths) : 0; i <= monthtrs.length - 1; i += 1) {
              monthtrs[i]?.setAttribute('class', 'ant-calendar-month-panel-cell-disabled');
            };
          } else {
            for (let i = 0; i < monthtrs.length; i += 1) {
              monthtrs[i]?.removeAttribute('class', 'ant-calendar-month-panel-cell-disabled');
            };
          };
          if (moment(startdates).format('YYYY') === moment(yeartext).format('YYYY')) {
            const startmonth = moment(startdates).format('M');
            monthtrs[Number(startmonth) - 1]?.setAttribute('class', 'ant-calendar-month-panel-selected-cell');
          };
        };
      };
      if (selectTag === '按年') {
        const yeartds = document.getElementsByClassName('ant-calendar-year-panel-tbody')[0]?.getElementsByTagName('td');
        if (yeartds && yeartds.length) {
          for (let i = 1; i < 11; i += 1) {
            if (moment(yeartds[i]?.children[0]?.innerHTML).format('YYYY') > moment(enddates).format('YYYY')) {
              yeartds[i]?.setAttribute('class', 'ant-calendar-year-panel-cell-disabled');
            }
          };
        }
      }
    };
    if (startdates && dateOpen.end) {
      if (selectTag === '按月') {
        const monthtrs = document.getElementsByClassName('ant-calendar-month-panel-tbody')[0]?.getElementsByTagName('td')
        const disablemonths = moment(startdates).format('M');
        if (monthtrs && monthtrs.length) {
          if (moment(yeartext).format('YYYY') <= moment(startdates).format('YYYY')) {
            const length = moment(startdates).format('YYYY') === moment(yeartext).format('YYYY') ? Number(disablemonths) : 12
            for (let i = 0; i < length; i += 1) {
              monthtrs[i]?.setAttribute('class', 'ant-calendar-month-panel-cell-disabled');
            };
          } else {
            for (let i = 0; i < monthtrs.length; i += 1) {
              monthtrs[i]?.removeAttribute('class', 'ant-calendar-month-panel-cell-disabled');
            };
          }
        }
      };
      if (selectTag === '按年') {
        const yeartds = document.getElementsByClassName('ant-calendar-year-panel-tbody')[0]?.getElementsByTagName('td');
        if (yeartds && yeartds.length) {
          for (let i = 1; i < 11; i += 1) {
            if (moment(yeartds[i]?.children[0]?.innerHTML).format('YYYY') < moment(startdates).format('YYYY')) {
              yeartds[i]?.setAttribute('class', 'ant-calendar-year-panel-cell-disabled');
            }
          };
        }
      }
    }
  }, 5)

  return (
    <PageHeaderWrapper
      title={pagetitle}
      tabList={tabList}
      tabActiveKey={tabActivekey}
      onTabChange={handleTabChange}
    >
      <DictLower
        typeid="443"
        ChangeSelectdata={newvalue => setSelectData(newvalue)}
        style={{ display: 'none' }}
      />
      <Card>
        <Form {...formItemLayout}>
          <Row>
            <Col span={12} style={{ paddingTop: 4 }}>
              <div style={{ width: 280, textAlign: 'right', position: 'absolute', left: '-10px', top: 12, paddingLeft: 0 }}>
                <span style={{ fontSize: 14, }}>{tabActivekey === 'successrate' ? '发布时间' : '出厂测试登记时间'}：</span>
                {tagsFromServer.map(obj => {
                  return (
                    <CheckableTag
                      key={obj}
                      checked={selectTag === obj}
                      onChange={checked => handleChang(obj, checked)}
                    >
                      {obj}
                    </CheckableTag>
                  )
                })}
              </div>
              <div style={{ marginLeft: 280 }}>
                <div style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
                  <DatePicker
                    value={startdates}
                    placeholder="开始时间"
                    format={formatmap.get(selectTag)}
                    style={{ minWidth: 120, width: '100%' }}
                    mode={modemap.get(selectTag)}
                    onPanelChange={(v) => {
                      if (selectTag === '按月' && ((enddates && (moment(v).format('YYYY-MM') <= moment(enddates).format('YYYY-MM')) || !enddates))) {
                        setStartDates(moment(v).startOf('month'));
                        setDateOpen({ start: false, end: false });
                      };
                      if (selectTag === '按年' && ((enddates && (moment(v).format('YYYY') <= moment(enddates).format('YYYY'))) || !enddates)) {
                        setStartDates(moment(v).startOf('year'));
                        setDateOpen({ start: false, end: false });
                      }
                    }}
                    onOpenChange={(status) => {
                      setDateOpen({ start: status, end: false });
                    }}
                    onChange={(v) => {
                      setStartDates(v);
                    }}
                    open={dateOpen.start}
                    disabledDate={disastartbledDate}
                  />
                </div>
                <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>-</span>
                <div style={{ display: 'inline-block', width: 'calc(50% - 12px)' }}>
                  <DatePicker
                    value={enddates}
                    placeholder="结束时间"
                    format={formatmap.get(selectTag)}
                    style={{ minWidth: 120, width: '100%' }}
                    mode={modemap.get(selectTag)}
                    onPanelChange={(v) => {
                      if (selectTag === '按月' && ((startdates && (moment(v).format('YYYY-MM') >= moment(startdates).format('YYYY-MM')) || !enddates))) {
                        setEndDates(moment(v).endOf('month'));
                        setDateOpen({ start: false, end: false });
                      };
                      if (selectTag === '按年' && ((startdates && (moment(v).format('YYYY') >= moment(startdates).format('YYYY'))) || !enddates)) {
                        setEndDates(moment(v).endOf('year'));
                        setDateOpen({ start: false, end: false });
                      }
                    }}
                    onOpenChange={(status) => {
                      setDateOpen({ start: false, end: status })
                    }}
                    onChange={(v) => {
                      setEndDates(v);
                    }}
                    open={dateOpen.end}
                    disabledDate={disaendbledDate}
                  />
                </div>
              </div>
            </Col>
            <Col span={4}>
              <Form.Item label="发布类型">
                {getFieldDecorator('releaseType', {
                  initialValue: tabActivekey === 'successrate' ? '' : '计划发布',
                })(
                  <Select placeholder="请选择" allowClear={tabActivekey === 'successrate'}>
                    {tabActivekey === 'successrate' && (<Option key='3' value=''>全部</Option>)}
                    {/* {typemap.map(obj => (
                      <Option key={obj.key} value={obj.title}>
                        {obj.title}
                      </Option>
                    ))} */}
                    <Option key='1' value='计划发布'>计划发布</Option>
                    <Option key='2' value='临时发布'>临时发布</Option>
                  </Select>,
                )}
              </Form.Item>
            </Col>
            {tabActivekey === 'process' && (<Col span={4}>
              <Form.Item label="责任单位">
                {getFieldDecorator('dutyUnit', {
                  initialValue: '',
                })(
                  <Select placeholder="请选择" allowClear>
                    {unitmap.map(obj => (
                      <Option key={obj.key} value={obj.title}>
                        {obj.title}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>)}
            <Col span={4} style={{ padding: '4px 0 0 24px' }}>
              <Button type="primary" onClick={() => handleSearch(1, 15)}>查 询</Button>
              <Button style={{ marginLeft: 8 }} onClick={() => handleReset()}>重 置</Button>
            </Col>
            {tabActivekey === 'successrate' && (<Col span={24} style={{ textAlign: 'right' }}>
              <Radio.Group>
                <Radio.Button value="sucess" onClick={() => setDefaultColumns(defaultColRecord.success)} >通过项</Radio.Button>
                <Radio.Button value="fail" onClick={() => setDefaultColumns(defaultColRecord.fail)}>未通过项</Radio.Button>
                <Popover
                  content={content}
                  trigger="click"
                  visible={visible}
                  onVisibleChange={v => setVisible(v)}
                  placement="left"
                >
                  <Tooltip title="自定义表头">
                    <Radio.Button value="setting" style={{ background: '#e1e1e1' }}  >
                      <Icon type="setting" />
                    </Radio.Button>
                  </Tooltip>
                </Popover>
              </Radio.Group>
              {/* <ButtonGroup style={{ background: '#e1e1e1', }} >
                <Button onClick={() => setDefaultColumns(defaultColRecord.success)}>显示通过项</Button>
                <Button onClick={() => setDefaultColumns(defaultColRecord.fail)}>显示未通过项</Button>
              </ButtonGroup>
              <Popover
                content={content}
                trigger="click"
                visible={visible}
                onVisibleChange={v => setVisible(v)}
                placement="left"
              >
                <Tooltip title="自定义表头">
                  <Button icon="setting" style={{ background: '#e1e1e1', marginLeft: 8 }} />
                </Tooltip>
              </Popover> */}
            </Col>)}
          </Row>
        </Form>
        {tabActivekey === 'successrate' && (<Table
          loading={loading || !selectdata.ischange}
          columns={defaultColumns && defaultColumns.length > 0 ? tableColumns(defaultColumns) : []}
          dataSource={successratelist?.records || []}
          rowKey={(_, index) => index.toString()}
          pagination={pagination}
          scroll={{ x: 1500 }}
        />)}
        {tabActivekey === 'process' && (<Table
          loading={loading || !selectdata.ischange}
          columns={columns}
          dataSource={tasksumlist || []}
          rowKey={(_, index) => index.toString()}
          pagination={false}
          scroll={{ x: 1500 }}
        />)}
      </Card>
    </PageHeaderWrapper>
  );
}

export default Form.create({})(
  connect(({ releasestatistics, loading }) => ({
    successratelist: releasestatistics.successrate,
    tasksumlist: releasestatistics.tasksum,
    loading: loading.models.releasestatistics,
  }))(Statistics),
);