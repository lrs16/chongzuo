import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Row, Col, Avatar, Empty, Spin, InputNumber, Drawer, Table, Input, Divider, Button, message } from 'antd';
import StatisticsCard from '@/components/StatisticsCard';
import SelectTime from '@/components/SelectTime/SelectTime';
import DonutPCT from '@/components/CustomizeCharts/DonutPCT';
import SmoothLine from '@/components/CustomizeCharts/SmoothLine';
import Cylinder from '@/components/CustomizeCharts/Cylinder';
import styles from '../index.less';
import {
  summaryDetailExport,
  taskStatisticalExport,
  unitStatisticalExport,
  typeStatisticalExport,
  timeOutOrderExport,
  abilityTimeOutExport,
  timeOutTaskExport,
  unitTimeOutExport,
  assigneeTimeOutExport
} from './services/api';

import { columns, columnstask, columnrelease } from './columns'

const cols = {
  rate: {
    // alias: '%',
    // tickCount: 10,
  },
};

function Statistics(props) {
  const { dispatch, loadingsum,
    analysis: { summary, platsum, bizsum, donesum, bizchecksum },
    unitdata: { unitanalysis, typeanalysis },
    timeoutdata: { orederanalysis, taskanalysis, unittimeout, assigneetimeout },
    ability: { allability, frontability, backability },
    loadinglist, list
  } = props;
  // const [picval, setPicVal] = useState({});
  const [values, setValues] = useState({});
  const [topN, setTopN] = useState(5);
  const [visible, setVisible] = useState(false);
  const [paginations, setPageinations] = useState({ current: 1, pageSize: 12 });
  const [fetchType, setFetchType] = useState({});

  const piesum = (arr) => {
    let sum = 0;
    if (arr && arr.length > 0) {
      arr.forEach(item => {
        sum += item.value;
      });
    };
    return sum
  };

  const dataArr = datas => {
    const newArr = [];
    if (!Array.isArray(datas)) {
      return newArr;
    }
    for (let i = 0; i < datas.length; i += 1) {
      const vote = {};
      vote.value = datas[i].value;
      vote.name = datas[i].type;
      vote.date = datas[i].date;
      newArr.push(vote);
    }
    return newArr;
  };

  const dataCylinder = datas => {
    const newArr = [];
    if (!Array.isArray(datas) || datas.length === 0) {
      return newArr;
    }
    for (let i = 0; datas.length < 5 ? i < datas.length : i < 5; i += 1) {
      const vote = {};
      vote.name = datas[i].name;
      vote.rate = datas[i].value;
      vote.expected = datas[0].value;
      newArr.push(vote);
    }
    return newArr.reverse();
  };

  const dataAssigneetimeout = datas => {
    const newArr = [];
    if (!Array.isArray(datas) || datas.length === 0) {
      return newArr;
    }
    for (let i = 0; datas.length < topN ? i < datas.length : i < topN; i += 1) {
      const vote = {};
      vote.name = datas[i].name;
      vote.rate = datas[i].value;
      vote.expected = datas[0].value;
      newArr.push(vote);
    }
    return newArr.reverse();
  };
  const handleInput = (val) => {
    setTopN(val)
  };

  useEffect(() => {
    if (values && values.type) {
      const val = {
        begin: moment(values.beginTime).format('YYYY-MM-DD'),
        end: moment(values.endTime).format('YYYY-MM-DD'),
        type: values.type
      }
      dispatch({
        type: 'releaseanalysis/fetchsum',
        payload: { ...val },
      });
      dispatch({
        type: 'releaseanalysis/fetchunit',
        payload: { ...val },
      });
      dispatch({
        type: 'releaseanalysis/fetchtimeout',
        payload: { ...val },
      });
      dispatch({
        type: 'releaseanalysis/fetchability',
        payload: { ...val },
      });
    }
  }, [values]);

  const getList = (obj) => {
    const { type, name, taskName, item, unit, releaseType, timeout, ability, subAbility, datetype, date, userName, pageIndex, pageSize } = obj;
    setFetchType(obj);
    const beginTime = moment(values.beginTime).format('YYYY-MM-DD');
    const endTime = moment(values.endTime).format('YYYY-MM-DD');
    const beginformat = date && beginTime === endTime ? `YYYY-MM-DD ${date}:00:00` : 'YYYY-MM-DD 00:00:00';
    const endformat = date && beginTime === endTime ? `YYYY-MM-DD ${date}:59:59` : 'YYYY-MM-DD 23:59:59';
    const val = {
      type: datetype || values.type,
      pageIndex,
      pageSize,
      begin: moment(date && beginTime !== endTime ? date : values.beginTime).format(beginformat),
      end: moment(date && beginTime !== endTime ? date : values.endTime).format(endformat),
    };
    dispatch({
      type: 'releaseanalysis/fetchlist',
      payload: { val, name, type, taskName, item, unit, releaseType, timeout, ability, subAbility, userName },
    });
    setVisible(true);
  };

  const resdownload = (res) => {
    if (res) {
      const filename = `${fetchType.name}_${moment().format('YYYY-MM-DD HH:mm')}.xls`;
      const blob = new Blob([res]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);
    } else {
      message.error('下载失败')
    }
  }

  const download = () => {
    const val = {
      type: fetchType.datetype || values.type,
      begin: moment(fetchType.date || values.beginTime).format('YYYY-MM-DD 00:00:00'),
      end: moment(fetchType.date || values.endTime).format('YYYY-MM-DD 23:59:59'),
    };
    switch (fetchType.type) {
      case 'summary':
        summaryDetailExport({ ...val, item: fetchType.name }).then(res => { resdownload(res) })
        break;
      case 'taskStatistical':
        taskStatisticalExport({ ...val, item: fetchType.item, taskName: fetchType.taskName, }).then(res => { resdownload(res) })
        break;
      case 'unitStatistical':
        unitStatisticalExport({ ...val, unit: fetchType.unit, }).then(res => { resdownload(res) })
        break;
      case 'typeStatistical':
        typeStatisticalExport({ ...val, releaseType: fetchType.releaseType, }).then(res => { resdownload(res) })
        break;
      case 'timeOutOrder':
        timeOutOrderExport({ ...val, timeout: fetchType.timeout, }).then(res => { resdownload(res) })
        break;
      case 'abilityTimeOut':
        abilityTimeOutExport({ ...val, ability: fetchType.ability, subAbility: fetchType.subAbility }).then(res => { resdownload(res) })
        break;
      case 'timeOutTask':
        timeOutTaskExport({ ...val, taskName: fetchType.taskName }).then(res => { resdownload(res) })
        break;
      case 'unitTimeOut':
        unitTimeOutExport({ ...val, unit: fetchType.unit }).then(res => { resdownload(res) })
        break;
      case 'assigneeTimeOut':
        assigneeTimeOutExport({ ...val, userName: fetchType.userName }).then(res => { resdownload(res) })
        break;
      default:
        break;
    };
  }

  const onClose = () => {
    setVisible(false)
  };

  const onShowSizeChange = (page, size) => {
    getList({ ...fetchType, pageIndex: 1, pageSize: size });
    setPageinations({
      ...paginations,
      current: 1,
      pageSize: size,
    });
  };

  const changePage = page => {
    getList({ ...fetchType, pageIndex: page, pageSize: paginations.pageSize });
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
    total: list.total,
    showTotal: total => `总共  ${total}  条记录`,
    onChange: page => changePage(page),
  };



  const card = (val, suffixmap) => {
    const { name, total, ringRatio, prevTotal } = val;
    return (< StatisticsCard
      title={`${name}：`}
      value={total}
      suffix={suffixmap.get(name)}
      des='环比'
      desval={ringRatio}
      type={prevTotal * 100 < total * 100 ? 'up' : 'down'} />)
  }

  return (
    <div>
      <SelectTime ChangeDate={(v) => setValues(v)} />
      <Spin spinning={loadingsum}>
        <Row style={{ marginTop: 24 }}>
          <div className={styles.statisticscard}>
            <Avatar icon="desktop" />
            <b>发布总情况</b>
          </div>
          {(!summary || (summary && summary.length === 0)) && <Empty style={{ height: '100px' }} />}
          {summary && summary.length > 0 && summary.map((item) => {
            const suffixmap = new Map([
              ['发布总次数', '次'],
              ['总功能项', '项'],
              ['发布成功项', '项'],
              ['发布成功率', '%'],
            ]);
            const val = { type: 'summary', name: item.name, pageIndex: 1, pageSize: 12 }
            return (
              <Col span={6}>
                {item.name === '发布成功率' ? (card(item, suffixmap)) : (
                  <a onMouseDown={() => setFetchType({})} onClick={() => { getList(val); setPageinations({ current: 1, pageSize: 12 }) }}>
                    {card(item, suffixmap)}
                  </a>
                )}
              </Col>)
          })}
        </Row>
        <Row gutter={16}>
          {platsum && (<Col span={12} style={{ marginTop: 24 }}>
            <div className={styles.statisticscard}>
              <Avatar icon="desktop" />
              <b>平台验证情况</b>
            </div>
            {(!platsum || (platsum && platsum.length === 0)) && <Empty style={{ height: '100px' }} />}
            <Row>
              {platsum && platsum.length > 0 && platsum.map((item) => {
                const suffixmap = new Map([
                  ['平台验证通过项', '项'],
                  ['平台验证未通过项', '项'],
                  ['平台验证通过率', '%'],
                ]);
                const val = {
                  type: 'taskStatistical',
                  name: item.name,
                  taskName: '平台验证',
                  pageIndex: 1,
                  pageSize: 12
                }
                return (
                  <Col span={8}>
                    {item.name === '平台验证通过率' ?
                      (card(item, suffixmap)) :
                      (
                        <a
                          onMouseDown={() => setFetchType({})}
                          onClick={() => {
                            getList({ ...val, item: item.name === '平台验证通过项' ? '通过' : '不通过' });
                            setPageinations({ current: 1, pageSize: 12 });
                          }}>
                          {card(item, suffixmap)}
                        </a>
                      )
                    }
                  </Col>)
              })}
            </Row>
          </Col>)}
          {bizsum && (<Col span={12} style={{ marginTop: 24 }}>
            <div className={styles.statisticscard}>
              <Avatar icon="file-protect" />
              <b>业务验证情况</b>
            </div>
            {(!bizsum || (bizsum && bizsum.length === 0)) && <Empty style={{ height: '100px' }} />}
            <Row>
              {bizsum && bizsum.length > 0 && bizsum.map((item) => {
                const suffixmap = new Map([
                  ['业务验证通过项', '项'],
                  ['业务验证未通过项', '项'],
                  ['业务验证通过率', '%'],
                ]);
                const val = {
                  type: 'taskStatistical',
                  name: item.name,
                  taskName: '业务验证',
                  pageIndex: 1,
                  pageSize: 12
                };
                return (
                  <Col span={8}>
                    {item.name === '业务验证通过率' ?
                      (card(item, suffixmap)) :
                      (
                        <a
                          onMouseDown={() => setFetchType({})}
                          onClick={() => {
                            getList({ ...val, item: item.name === '业务验证通过项' ? '通过' : '不通过' });
                            setPageinations({ current: 1, pageSize: 12 })
                          }}>
                          {card(item, suffixmap)}
                        </a>
                      )
                    }
                  </Col>)
              })}
            </Row>
          </Col>)}
        </Row>
        <Row gutter={16}>
          <Col span={12} style={{ marginTop: 24 }}>
            <div className={styles.statisticscard}>
              <Avatar icon="control" />
              <b>发布验证情况</b>
            </div>
            {(!donesum || (donesum && donesum.length === 0)) && <Empty style={{ height: '100px' }} />}
            <Row>
              {donesum && donesum.length > 0 && donesum.map((item) => {
                const suffixmap = new Map([
                  ['发布验证通过项', '项'],
                  ['发布验证未通过项', '项'],
                  ['发布验证通过率', '%'],
                ]);
                const val = {
                  type: 'taskStatistical',
                  name: item.name,
                  taskName: '发布验证',
                  pageIndex: 1,
                  pageSize: 12
                };
                return (
                  <Col span={8}>
                    {item.name === '发布验证通过率' ?
                      (card(item, suffixmap)) :
                      (
                        <a
                          onMouseDown={() => setFetchType({})}
                          onClick={() => {
                            getList({ ...val, item: item.name === '发布验证通过项' ? '通过' : '不通过' });
                            setPageinations({ current: 1, pageSize: 12 })
                          }}>
                          {card(item, suffixmap)}
                        </a>
                      )
                    }
                  </Col>)
              })}
            </Row>
          </Col>

          {bizchecksum && bizchecksum.length > 0 && bizchecksum && (<Col span={12} style={{ marginTop: 24 }}>
            <div className={styles.statisticscard}>
              <Avatar icon="security-scan" />
              <b>业务复核情况</b>
            </div>
            {(!bizchecksum || (bizchecksum && bizchecksum.length === 0)) && <Empty style={{ height: '100px' }} />}
            <Row>
              {bizchecksum && bizchecksum.map((item) => {
                const suffixmap = new Map([
                  ['业务复核通过项', '项'],
                  ['业务复核未通过项', '项'],
                  ['业务复核通过率', '%'],
                ]);
                const val = {
                  type: 'taskStatistical',
                  name: item.name,
                  taskName: '业务复核',
                  pageIndex: 1,
                  pageSize: 12
                };
                return (
                  <Col span={8}>
                    {item.name === '业务复核通过率' ?
                      (card(item, suffixmap)) :
                      (
                        <a
                          onMouseDown={() => setFetchType({})}
                          onClick={() => {
                            getList({ ...val, item: item.name === '业务复核通过项' ? '通过' : '不通过' });
                            setPageinations({ current: 1, pageSize: 12 })
                          }}>
                          {card(item, suffixmap)}
                        </a>
                      )
                    }
                  </Col>)
              })}
            </Row>
          </Col>
          )}
        </Row>
      </Spin>
      {unitanalysis && (
        <Row style={{ marginTop: 24 }} onMouseDown={() => setFetchType({})}>
          <div className={styles.statisticscard}>
            <Avatar icon="cluster" />
            <b>发布工单责任单位情况</b>
          </div>
          <Col span={8}>
            <Card>
              {(!unitanalysis.pieChart || (unitanalysis.pieChart && unitanalysis.pieChart.length === 0)) && <Empty style={{ height: '300px' }} />}
              {unitanalysis.pieChart && unitanalysis.pieChart.length > 0 && (
                <DonutPCT
                  data={unitanalysis.pieChart || []}
                  height={300}
                  totaltitle='发布总次数'
                  total={piesum(unitanalysis.pieChart)}
                  padding={[10, 30, 30, 30]}
                  onGetVal={(v) => {
                    getList({ type: 'unitStatistical', name: v.type, unit: v.type, pageIndex: 1, pageSize: 12 });
                    setPageinations({ current: 1, pageSize: 12 })
                  }}
                  onGetTotal={(v) => {
                    getList({ type: 'unitStatistical', name: '发布总次数', unit: v, pageIndex: 1, pageSize: 12 });
                    setPageinations({ current: 1, pageSize: 12 })
                  }}
                  totalType='all'
                />
              )}
            </Card>
          </Col>
          <Col span={16}>
            <Card style={{ marginLeft: '-1px' }}>
              {(!unitanalysis.lineChart || (unitanalysis.lineChart && unitanalysis.lineChart.length === 0)) && <Empty style={{ height: '300px' }} />}
              {unitanalysis.lineChart && unitanalysis.lineChart.length > 0 && (
                <SmoothLine
                  data={dataArr(unitanalysis.lineChart)}
                  height={300}
                  padding={[30, 0, 60, 60]}
                  onGetVal={(v) => {
                    getList({
                      type: 'unitStatistical',
                      name: v.name,
                      unit: v.name,
                      datetype: 'D',
                      date: v.date,
                      pageIndex: 1,
                      pageSize: 12
                    });
                    setPageinations({ current: 1, pageSize: 12 })
                  }}
                />
              )}
            </Card>
          </Col>
        </Row>
      )}
      {typeanalysis && (
        <Row style={{ marginTop: 24 }} onMouseDown={() => setFetchType({})}>
          <div className={styles.statisticscard}>
            <Avatar icon="cluster" />
            <b>发布类型统计分析</b>
          </div>
          <Col span={8}>
            <Card>
              {(!typeanalysis.pieChart || (typeanalysis.pieChart && typeanalysis.pieChart.length === 0)) && <Empty style={{ height: '300px' }} />}
              {typeanalysis.pieChart && typeanalysis.pieChart.length > 0 && (
                <DonutPCT
                  data={typeanalysis.pieChart || []}
                  height={300}
                  totaltitle='发布总次数'
                  total={piesum(typeanalysis.pieChart)}
                  padding={[10, 30, 30, 30]}
                  onGetVal={(v) => {
                    getList({ type: 'typeStatistical', name: v.type, releaseType: v.type, pageIndex: 1, pageSize: 12 });
                    setPageinations({ current: 1, pageSize: 12 })
                  }}
                  onGetTotal={(v) => {
                    getList({ type: 'typeStatistical', name: '发布总次数', releaseType: v, pageIndex: 1, pageSize: 12 });
                    setPageinations({ current: 1, pageSize: 12 })
                  }}
                  totalType='all'
                />)}
            </Card>
          </Col>
          <Col span={16}>
            <Card style={{ marginLeft: '-1px' }}>
              {(!typeanalysis.lineChart || (typeanalysis.lineChart && typeanalysis.lineChart.length === 0)) && <Empty style={{ height: '300px' }} />}
              {typeanalysis.lineChart && typeanalysis.lineChart.length > 0 && (
                <SmoothLine
                  data={dataArr(typeanalysis.lineChart || [])}
                  height={300}
                  padding={[30, 0, 60, 60]}
                  onGetVal={(v) => {
                    getList({
                      type: 'typeStatistical',
                      name: v.name,
                      releaseType: v.name,
                      datetype: 'D',
                      date: v.date,
                      pageIndex: 1,
                      pageSize: 12
                    });
                    setPageinations({ current: 1, pageSize: 12 });
                  }}
                />
              )}
            </Card>
          </Col>
        </Row>
      )}
      <Row style={{ marginTop: 24 }} gutter={16} onMouseDown={() => setFetchType({})}>
        <Col span={12}>
          <div className={styles.statisticscard}>
            <Avatar icon="share-alt" />
            <b>发布超时总情况</b>
          </div>
          <Card>
            {(!orederanalysis || (orederanalysis && orederanalysis.length === 0) ||
              (orederanalysis && orederanalysis.length === 2 && orederanalysis[0].value === 0 && orederanalysis[1].value === 0))
              ?
              <Empty style={{ height: '300px' }} /> : <DonutPCT
                data={orederanalysis || []}
                height={300}
                totaltitle='发布总次数'
                total={piesum(orederanalysis)}
                padding={[10, 30, 30, 30]}
                onGetVal={(v) => {
                  getList({ type: 'timeOutOrder', name: v.type, timeout: v.type === '按时处理' ? 'N' : 'Y', pageIndex: 1, pageSize: 12 });
                  setPageinations({ current: 1, pageSize: 12 })
                }}
                onGetTotal={(v) => {
                  getList({ type: 'timeOutOrder', name: '发布总次数', timeout: v, pageIndex: 1, pageSize: 12 });
                  setPageinations({ current: 1, pageSize: 12 })
                }}
                totalType='all'
              />}
          </Card>
        </Col>
        <Col span={12}>
          <div className={styles.statisticscard}>
            <Avatar icon="share-alt" />
            <b>环节超时Top5</b>
          </div>
          <Card>
            {taskanalysis && taskanalysis.length === 0 && <Empty style={{ height: '300px' }} />}
            {taskanalysis && taskanalysis.length > 0 && (
              <Cylinder
                height={300}
                data={dataCylinder(taskanalysis)}
                padding={[10, 50, 30, 120]}
                symbol=""
                cols={cols}
                colors="l(270) 0:#04e8ff 0.5:#05bdfe 1:#05bdfe"
                onGetVal={(v) => {
                  getList({
                    columnstask: true,
                    type: 'timeOutTask',
                    name: v.name,
                    taskName: v.name,
                    pageIndex: 1,
                    pageSize: 12
                  });
                  setPageinations({ current: 1, pageSize: 12 })
                }}
              />
            )}
          </Card>
        </Col>
      </Row>
      <Row style={{ marginTop: 24 }} gutter={16} onMouseDown={() => setFetchType({})}>
        <Col span={12}>
          <div className={styles.statisticscard}>
            <Avatar icon="share-alt" />
            <b>责任单位超时Top</b>
          </div>
          <Card>
            {unittimeout && unittimeout.length === 0 && <Empty style={{ height: '300px' }} />}
            {unittimeout && unittimeout.length > 0 && (
              <Cylinder
                height={300}
                data={dataCylinder(unittimeout)}
                padding={[10, 50, 30, 100]}
                symbol=""
                cols={cols}
                colors="l(180) 0:#c408f8 0.5:#8105fb 1:#8105fb"
                onGetVal={(v) => {
                  getList({
                    listcolumns: true,
                    type: 'unitTimeOut',
                    name: `超时责任单位：${v.name}`,
                    unit: v.name,
                    pageIndex: 1,
                    pageSize: 12
                  });
                  setPageinations({ current: 1, pageSize: 12 })
                }}
              />
            )}
          </Card>
        </Col>
        <Col span={12}>
          <div className={styles.statisticscard}>
            <Avatar icon="share-alt" />
            <b>责任人超时Top{topN}</b>
            <div style={{ float: 'right' }} >n：<InputNumber defaultValue={5} onChange={handleInput} /></div>
          </div>
          <Card>
            {(!assigneetimeout || (assigneetimeout && assigneetimeout.length === 0)) && <Empty style={{ height: '300px' }} />}
            {assigneetimeout && assigneetimeout.length > 0 && (
              <Cylinder
                height={300}
                data={dataAssigneetimeout(assigneetimeout)}
                padding={[10, 50, 30, 70]}
                symbol=""
                cols={cols}
                colors="l(180) 0:#ffbb02 0.5:#fe7402 1:#fe7402"
                onGetVal={(v) => {
                  getList({
                    columnstask: true,
                    type: 'assigneeTimeOut',
                    name: `超时责任人：${v.name}`,
                    userName: v.name,
                    pageIndex: 1,
                    pageSize: 12
                  });
                  setPageinations({ current: 1, pageSize: 12 })
                }}
              />
            )}
          </Card>
        </Col>
      </Row>
      <Row style={{ marginTop: 24 }} gutter={16} onMouseDown={() => setFetchType({})}>
        <Col span={8}>
          <div className={styles.statisticscard}>
            <Avatar icon="share-alt" />
            <b>功能类型统计总情况</b>
          </div>
          <Card>
            {(!allability || (allability && allability.length === 0)) && <Empty style={{ height: '300px' }} />}
            {allability && allability.length > 0 && (
              <DonutPCT
                data={allability || []}
                height={300}
                totaltitle='清单数'
                total={piesum(allability)}
                padding={[10, 30, 30, 30]}
                onGetVal={(v) => {
                  getList({ type: 'abilityTimeOut', name: v.type, ability: v.type === '前台功能' ? 'front' : 'back', pageIndex: 1, pageSize: 12 });
                  setPageinations({ current: 1, pageSize: 12 })
                }}
                onGetTotal={(v) => {
                  getList({ type: 'abilityTimeOut', name: '功能类型统计', ability: v, pageIndex: 1, pageSize: 12 });
                  setPageinations({ current: 1, pageSize: 12 })
                }}
                totalType='all'
              />
            )}
          </Card>
        </Col>
        <Col span={8}>
          <div className={styles.statisticscard}>
            <Avatar icon="share-alt" />
            <b>功能类型-前台功能统计情况</b>
          </div>
          <Card>
            {(!frontability || (frontability && frontability.length === 0)) && <Empty style={{ height: '300px' }} />}
            {frontability && frontability.length > 0 && (
              <DonutPCT
                data={frontability || []}
                height={300}
                totaltitle='清单数'
                total={piesum(frontability)}
                padding={[10, 30, 30, 30]}
                onGetVal={(v) => {
                  getList({ type: 'abilityTimeOut', name: `前台功能${v.type}`, ability: 'front', subAbility: v.type, pageIndex: 1, pageSize: 12 });
                  setPageinations({ current: 1, pageSize: 12 })
                }}
                onGetTotal={() => {
                  getList({ type: 'abilityTimeOut', name: '前台功能统计', ability: 'front', subAbility: '', pageIndex: 1, pageSize: 12 });
                  setPageinations({ current: 1, pageSize: 12 })
                }}
                totalType='all'
              />
            )}
          </Card>
        </Col>
        <Col span={8}>
          <div className={styles.statisticscard}>
            <Avatar icon="share-alt" />
            <b>功能类型-后台功能统计情况</b>
          </div>
          <Card>
            {(!backability || (backability && backability.length === 0)) && <Empty style={{ height: '300px' }} />}
            {backability && backability.length > 0 && (
              <DonutPCT
                data={backability || []}
                height={300}
                totaltitle='清单数'
                total={piesum(backability)}
                padding={[10, 30, 30, 30]}
                onGetVal={(v) => {
                  getList({ type: 'abilityTimeOut', name: `后台功能${v.type}`, ability: 'back', subAbility: v.type, pageIndex: 1, pageSize: 12 });
                  setPageinations({ current: 1, pageSize: 12 })
                }}
                onGetTotal={() => {
                  getList({ type: 'abilityTimeOut', name: '后台功能统计', ability: 'back', subAbility: '', pageIndex: 1, pageSize: 12 });
                  setPageinations({ current: 1, pageSize: 12 })
                }}
                totalType='all'
              />
            )}
          </Card>
        </Col>
      </Row>
      <Drawer
        width={1550}
        title={fetchType.name}
        onClose={onClose}
        visible={visible}
      >
        <Button onClick={() => download()} type='primary' style={{ marginBottom: 12 }}>导出数据</Button>
        {fetchType.columnstask ? (
          <Table
            columns={columnstask}
            loading={loadinglist}
            dataSource={list.records || []}
            pagination={pagination}
          />
        ) : (
          <Table
            columns={
              (fetchType.name === '发布总次数' ||
                fetchType.name === '软件运维' ||
                fetchType.name === '功能开发' ||
                fetchType.name === '计划发布' ||
                fetchType.name === '临时发布' ||
                fetchType.name === '按时处理' ||
                fetchType.name === '已超时' ||
                fetchType.listcolumns
              )
                ? columns : columnrelease}
            loading={loadinglist}
            dataSource={list.records || []}
            pagination={pagination}
          />
        )}
      </Drawer>
    </div>
  );
}

export default connect(({ releaseanalysis, loading }) => ({
  analysis: releaseanalysis.analysis,
  unitdata: releaseanalysis.unitdata,
  timeoutdata: releaseanalysis.timeoutdata,
  ability: releaseanalysis.ability,
  list: releaseanalysis.list,
  loadingsum: loading.effects['releaseanalysis/fetchsum'],
  loadingunit: loading.effects['releaseanalysis/fetchunit'],
  loadinglist: loading.effects['releaseanalysis/fetchlist'],
}))(Statistics);