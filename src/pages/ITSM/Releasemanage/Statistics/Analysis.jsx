import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Card, Row, Col, Avatar, Empty, Spin } from 'antd';
import StatisticsCard from '@/components/StatisticsCard';
import SelectTime from '@/components/SelectTime/SelectTime';
import DonutPCT from '@/components/CustomizeCharts/DonutPCT';
import SmoothLine from '@/components/CustomizeCharts/SmoothLine';
import Cylinder from '@/components/CustomizeCharts/Cylinder';
import styles from '../index.less';

const cols = {
  rate: {
    // alias: '%',
    // tickCount: 10,
  },
};

function Statistics(props) {
  const { dispatch, loadingsum,
    analysis: { summary, platsum, bizsum, donesum, bizchecksum, },
    unitdata: { unitanalysis, typeanalysis },
    timeoutdata: { orederanalysis, taskanalysis, unittimeout, assigneetimeout },
    ability: { allability, frontability, backability }
  } = props;
  const [picval, setPicVal] = useState({});
  const [values, setValues] = useState({});

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
    if (!Array.isArray(datas)) {
      return newArr;
    }
    for (let i = 0; i < datas.length; i += 1) {
      const vote = {};
      vote.name = datas[i].name;
      vote.rate = datas[i].value;
      vote.type = '环节';
      newArr.push(vote);
    }
    return newArr;

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
  }, [values])

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
          {summary && summary.length > 0 && summary.map(({ name, total, prevTotal, ringRatio }) => {
            const suffixmap = new Map([
              ['发布总次数', '次'],
              ['总功能项', '项'],
              ['发布成功项', '项'],
              ['发布成功率', '%'],
            ])
            return (
              <Col span={6}>
                <StatisticsCard title={`${name}：`} value={total} suffix={suffixmap.get(name)} des='环比' desval={ringRatio} type={prevTotal * 100 < total * 100 ? 'up' : 'down'} />
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
              {platsum && platsum.length > 0 && platsum.map(({ name, total, prevTotal, ringRatio }) => {
                const suffixmap = new Map([
                  ['平台验证通过项', '项'],
                  ['平台验证未通过项', '项'],
                  ['平台验证成功率', '%'],
                ])
                return (
                  <Col span={8}>
                    <StatisticsCard title={`${name}：`} value={total} suffix={suffixmap.get(name)} des='环比' desval={ringRatio} type={prevTotal * 100 < total * 100 ? 'up' : 'down'} />
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
              {bizsum && bizsum.length > 0 && bizsum.map(({ name, total, prevTotal, ringRatio }) => {
                const suffixmap = new Map([
                  ['业务验证通过项', '项'],
                  ['业务验证未通过项', '项'],
                  ['业务验证成功率', '%'],
                ])
                return (
                  <Col span={8}>
                    <StatisticsCard title={`${name}：`} value={total} suffix={suffixmap.get(name)} des='环比' desval={ringRatio} type={prevTotal * 100 < total * 100 ? 'up' : 'down'} />
                  </Col>)
              })}
            </Row>
          </Col>)}
        </Row>
        <Row gutter={16}>
          <Col span={12} style={{ marginTop: 24 }}>
            <div className={styles.statisticscard}>
              <Avatar icon="control" />
              <b>发布实施情况</b>
            </div>
            {(!donesum || (donesum && donesum.length === 0)) && <Empty style={{ height: '100px' }} />}
            <Row>
              {donesum && donesum.length > 0 && donesum.map(({ name, total, prevTotal, ringRatio }) => {
                const suffixmap = new Map([
                  ['发布实施通过项', '项'],
                  ['发布实施未通过项', '项'],
                  ['发布实施通过率', '%'],
                ])
                return (
                  <Col span={8}>
                    <StatisticsCard title={`${name}：`} value={total} suffix={suffixmap.get(name)} des='环比' desval={ringRatio} type={prevTotal * 100 < total * 100 ? 'up' : 'down'} />
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
              {bizchecksum && bizchecksum.map(({ name, total, prevTotal, ringRatio }) => {
                const suffixmap = new Map([
                  ['业务复核通过项', '项'],
                  ['业务复核未通过项', '项'],
                  ['业务复核通过率', '%'],
                ])
                return (
                  <Col span={8}>
                    <StatisticsCard title={`${name}：`} value={total} suffix={suffixmap.get(name)} des='环比' desval={ringRatio} type={prevTotal * 100 < total * 100 ? 'up' : 'down'} />
                  </Col>)
              })}
            </Row>
          </Col>
          )}
        </Row>
      </Spin>
      {unitanalysis && (
        <Row style={{ marginTop: 24 }}>
          <div className={styles.statisticscard}>
            <Avatar icon="cluster" />
            <b>发布工单责任单位情况</b>
          </div>
          <Col span={8}>
            <Card onMouseDown={() => setPicVal({})}>
              <DonutPCT
                data={unitanalysis.pieChart || []}
                height={300}
                totaltitle='发布总次数'
                total={piesum(unitanalysis.pieChart)}
                padding={[10, 30, 30, 30]}
                onGetVal={(v) => { setPicVal({ ...picval, dutyUnit: v }) }}
              />
            </Card>
          </Col>
          <Col span={16}>
            <Card onMouseDown={() => setPicVal({})} style={{ marginLeft: '-1px' }}>
              <SmoothLine
                data={dataArr(unitanalysis.lineChart || [])}
                height={300}
                padding={[30, 0, 60, 60]}
                onGetVal={(v) => { setPicVal({ ...picval, type: v }) }}
              />
            </Card>
          </Col>
        </Row>
      )}
      {typeanalysis && (
        <Row style={{ marginTop: 24 }}>
          <div className={styles.statisticscard}>
            <Avatar icon="cluster" />
            <b>发布类型统计分析</b>
          </div>
          <Col span={8}>
            <Card onMouseDown={() => setPicVal({})}>
              <DonutPCT
                data={typeanalysis.pieChart || []}
                height={300}
                totaltitle='发布总次数'
                total={piesum(typeanalysis.pieChart)}
                padding={[10, 30, 30, 30]}
                onGetVal={(v) => { setPicVal({ ...picval, dutyUnit: v }) }}
              />
            </Card>
          </Col>
          <Col span={16}>
            <Card onMouseDown={() => setPicVal({})} style={{ marginLeft: '-1px' }}>
              <SmoothLine
                data={dataArr(typeanalysis.lineChart || [])}
                height={300}
                padding={[30, 0, 60, 60]}
                onGetVal={(v) => { setPicVal({ ...picval, type: v }) }}
              />
            </Card>
          </Col>
        </Row>
      )}
      <Row style={{ marginTop: 24 }} gutter={16}>
        <Col span={12}>
          <div className={styles.statisticscard}>
            <Avatar icon="share-alt" />
            <b>发布超时总情况</b>
          </div>
          <Card onMouseDown={() => setPicVal({})}>
            {orederanalysis && orederanalysis.length === 0 && <Empty style={{ height: '300px' }} />}
            {orederanalysis && orederanalysis.length > 0 && (
              <DonutPCT
                data={orederanalysis}
                height={300}
                totaltitle=''
                total={piesum(orederanalysis)}
                padding={[10, 30, 30, 30]}
                onGetVal={(v) => { setPicVal({ ...picval, dutyUnit: v }) }}
              />
            )}
          </Card>
        </Col>
        <Col span={12}>
          <div className={styles.statisticscard}>
            <Avatar icon="share-alt" />
            <b>环节超时Top5</b>
          </div>
          <Card onMouseDown={() => setPicVal({})}>
            {taskanalysis && taskanalysis.length === 0 && <Empty style={{ height: '300px' }} />}
            {taskanalysis && taskanalysis.length > 0 && (
              <Cylinder
                height={300}
                data={dataCylinder(taskanalysis)}
                padding={[0, 50, 30, 150]}
                symbol=""
                cols={cols}
                colors="l(270) 0:#04e8ff 0.5:#05bdfe 1:#05bdfe"
                onGetVal={(v) => { setPicVal({ ...picval, type: v }); }}
              />
            )}
          </Card>
        </Col>
      </Row>
      <Row style={{ marginTop: 24 }} gutter={16}>
        <Col span={12}>
          <div className={styles.statisticscard}>
            <Avatar icon="share-alt" />
            <b>责任单位超时Top</b>
          </div>
          <Card onMouseDown={() => setPicVal({})}>
            {unittimeout && unittimeout.length === 0 && <Empty style={{ height: '300px' }} />}
            {unittimeout && unittimeout.length > 0 && (
              <Cylinder
                height={300}
                data={dataCylinder(unittimeout)}
                padding={[0, 50, 30, 150]}
                symbol=""
                cols={cols}
                colors="l(270) 0:#04e8ff 0.5:#05bdfe 1:#05bdfe"
                onGetVal={(v) => { setPicVal({ ...picval, type: v }); }}
              />
            )}
          </Card>
        </Col>
        <Col span={12}>
          <div className={styles.statisticscard}>
            <Avatar icon="share-alt" />
            <b>责任人超时Top5</b>
          </div>
          <Card onMouseDown={() => setPicVal({})}>
            {assigneetimeout && assigneetimeout.length === 0 && <Empty style={{ height: '300px' }} />}
            {assigneetimeout && assigneetimeout.length > 0 && (
              <Cylinder
                height={300}
                data={dataCylinder(assigneetimeout)}
                padding={[0, 50, 30, 150]}
                symbol=""
                cols={cols}
                colors="l(270) 0:#04e8ff 0.5:#05bdfe 1:#05bdfe"
                onGetVal={(v) => { setPicVal({ ...picval, type: v }); }}
              />
            )}
          </Card>
        </Col>
      </Row>
      <Row style={{ marginTop: 24 }} gutter={16}>
        <Col span={8}>
          <div className={styles.statisticscard}>
            <Avatar icon="share-alt" />
            <b>功能类型统计总情况</b>
          </div>
          <Card onMouseDown={() => setPicVal({})}>
            {allability && allability.length === 0 && <Empty style={{ height: '300px' }} />}
            {allability && allability.length > 0 && (
              <DonutPCT
                data={allability}
                height={300}
                totaltitle=''
                total={piesum(allability)}
                padding={[10, 30, 30, 30]}
                onGetVal={(v) => { setPicVal({ ...picval, dutyUnit: v }) }}
              />
            )}
          </Card>
        </Col>
        <Col span={8}>
          <div className={styles.statisticscard}>
            <Avatar icon="share-alt" />
            <b>功能类型-前台功能统计情况</b>
          </div>
          <Card onMouseDown={() => setPicVal({})}>
            {frontability && frontability.length === 0 && <Empty style={{ height: '300px' }} />}
            {frontability && frontability.length > 0 && (
              <DonutPCT
                data={frontability}
                height={300}
                totaltitle=''
                total={piesum(frontability)}
                padding={[10, 30, 30, 30]}
                onGetVal={(v) => { setPicVal({ ...picval, dutyUnit: v }) }}
              />
            )}
          </Card>
        </Col>
        <Col span={8}>
          <div className={styles.statisticscard}>
            <Avatar icon="share-alt" />
            <b>功能类型-后台功能统计情况</b>
          </div>
          <Card onMouseDown={() => setPicVal({})}>
            {backability && backability.length === 0 && <Empty style={{ height: '300px' }} />}
            {backability && backability.length > 0 && (
              <DonutPCT
                data={backability}
                height={300}
                totaltitle=''
                total={piesum(backability)}
                padding={[10, 30, 30, 30]}
                onGetVal={(v) => { setPicVal({ ...picval, dutyUnit: v }) }}
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default connect(({ releaseanalysis, loading }) => ({
  analysis: releaseanalysis.analysis,
  unitdata: releaseanalysis.unitdata,
  timeoutdata: releaseanalysis.timeoutdata,
  ability: releaseanalysis.ability,
  loadingsum: loading.effects['releaseanalysis/fetchsum'],
  loadingunit: loading.effects['releaseanalysis/fetchunit'],
}))(Statistics);