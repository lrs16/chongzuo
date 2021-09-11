import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Card, Row, Col, Avatar, Tag, DatePicker } from 'antd';
import StatisticsCard from '@/components/StatisticsCard';
import DonutPCT from '@/components/CustomizeCharts/DonutPCT';
import SmoothLine from '@/components/CustomizeCharts/SmoothLine';
import styles from '../index.less';

const { CheckableTag } = Tag;
const tagsFromServer = [{ name: '本日', key: '1' }, { name: '本月', key: '2' }];


// 饼图数据
const Donutdata = [
  { type: '博联', value: 600 },
  { type: '南瑞', value: 200 },
];

const Donutdata2 = [
  { type: '计划发布', value: 151 },
  { type: '临时发布', value: 200 },
];

function Statistics(props) {
  const { dispatch, Smoothdata } = props;
  const [selectedTags, setSelectedTags] = useState([]);
  const [picval, setPicVal] = useState({});

  const handleChang = (tag, checked) => {
    if (checked) {
      setSelectedTags([tag])
    }
  }

  useEffect(() => {
    dispatch({
      type: 'alarmovervies/fetchoversmooth',
      payload: { key: 'function' },
    });
  }, [])
  return (
    <div>
      <Card>
        <span style={{ fontSize: 16, fontWeight: 700, paddingRight: 12 }}>统计周期：</span>
        {tagsFromServer.map(obj => (
          <CheckableTag
            key={obj.key}
            checked={selectedTags.indexOf(obj) > -1}
            onChange={checked => handleChang(obj, checked)}
          >
            {obj.name}
          </CheckableTag>
        ))}
        <DatePicker placeholder="开始时间" />
        <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>-</span>
        <DatePicker placeholder="结束时间" />
      </Card>
      <Row style={{ marginTop: 24 }}>
        <div className={styles.statisticscard}>
          <Avatar icon="desktop" />
          <b>发布总情况</b>
        </div>
        <Col span={6}>
          <StatisticsCard title='发布总次数：' value={1128} suffix='次' des='环比上月' desval='11%' type='up' />
        </Col>
        <Col span={6}>
          <StatisticsCard title='出厂测试总功能项：' value={93} suffix='项' des='环比上月' desval='3.5%' type='down' />
        </Col>
        <Col span={6}>
          <StatisticsCard title='发布成功项：' value={935888} suffix='次' des='环比上月' desval='6%' type='up' />
        </Col>
        <Col span={6}>
          <StatisticsCard title='发布成功率：' value={89.558} suffix='%' des='环比上月' desval='6%' type='up' />
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12} style={{ marginTop: 24 }}>
          <div className={styles.statisticscard}>
            <Avatar icon="desktop" />
            <b>平台验证情况</b>
          </div>
          <Row>
            <Col span={12}><StatisticsCard title='平台验证通过项：' value={152} suffix='项' des='环比上月' desval='6%' type='up' /></Col>
            <Col span={12}><StatisticsCard title='平台验证未通过项：' value={2} suffix='项' des='环比上月' desval='6%' type='down' /></Col>
          </Row>
        </Col>
        <Col span={12} style={{ marginTop: 24 }}>
          <div className={styles.statisticscard}>
            <Avatar icon="file-protect" />
            <b>业务验证情况</b>
          </div>
          <Row>
            <Col span={12}><StatisticsCard title='业务验证通过项：' value={150} suffix='项' des='环比上月' desval='6%' type='up' /></Col>
            <Col span={12}><StatisticsCard title='业务验证未通过项：' value={2} suffix='项' des='环比上月' desval='6%' type='down' /></Col>
          </Row>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12} style={{ marginTop: 24 }}>
          <div className={styles.statisticscard}>
            <Avatar icon="control" />
            <b>发布实施情况</b>
          </div>
          <Row>
            <Col span={8}><StatisticsCard title='实施通过项：' value={148} suffix='项' des='环比上月' desval='6%' type='up' /></Col>
            <Col span={8}><StatisticsCard title='实施未通过项：' value={0} suffix='项' des='环比上月' desval='6%' type='down' /></Col>
            <Col span={8}><StatisticsCard title='实施成功率：' value={100.00} suffix='%' des='环比上月' desval='6%' type='down' /></Col>
          </Row>
        </Col>
        <Col span={12} style={{ marginTop: 24 }}>
          <div className={styles.statisticscard}>
            <Avatar icon="security-scan" />
            <b>业务复核情况</b>
          </div>
          <Row>
            <Col span={8}><StatisticsCard title='复核通过项：' value={148} suffix='项' des='环比上月' desval='6%' type='up' /></Col>
            <Col span={8}><StatisticsCard title='复核未通过项：' value={0} suffix='项' des='环比上月' desval='6%' type='down' /></Col>
            <Col span={8}><StatisticsCard title='复核成功率：' value={100.00} suffix='%' des='环比上月' desval='6%' type='down' /></Col>
          </Row>
        </Col>
      </Row>
      <Row style={{ marginTop: 24 }}>
        <div className={styles.statisticscard}>
          <Avatar icon="cluster" />
          <b>发布工单责任单位情况</b>
        </div>
        <Col span={8}>
          <Card onMouseDown={() => setPicVal({})}>
            <DonutPCT
              data={Donutdata}
              height={300}
              totaltitle='发布总次数'
              total='550'
              padding={[10, 30, 10, 30]}
              onGetVal={(v) => { setPicVal({ ...picval, dutyUnit: v }) }}
            />
          </Card>
        </Col>
        <Col span={16}>
          <Card onMouseDown={() => setPicVal({})} style={{ marginLeft: '-1px' }}>
            {Smoothdata && (
              <SmoothLine
                data={Smoothdata}
                height={300}
                padding={[30, 0, 50, 60]}
                onGetVal={(v) => { setPicVal({ ...picval, type: v }) }}
              />
            )}
          </Card>
        </Col>
      </Row>
      <Row style={{ marginTop: 24 }}>
        <div className={styles.statisticscard}>
          <Avatar icon="share-alt" />
          <b>发布类型统计分析</b>
        </div>
        <Col span={8}>
          <Card onMouseDown={() => setPicVal({})}>
            <DonutPCT
              data={Donutdata2}
              height={300}
              total="351"
              totaltitle='发布总次数'
              padding={[10, 30, 10, 30]}
              onGetVal={(v) => { setPicVal({ ...picval, dutyUnit: v }) }}
            />
          </Card>
        </Col>
        <Col span={16}>
          <Card onMouseDown={() => setPicVal({})} style={{ marginLeft: '-1px' }}>
            {Smoothdata && (
              <SmoothLine
                data={Smoothdata}
                height={300}
                padding={[30, 0, 50, 60]}
                onGetVal={(v) => { setPicVal({ ...picval, type: v }) }}
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default connect(({ alarmovervies, loading }) => ({
  Smoothdata: alarmovervies.Smoothdata,
  loading: loading.models.alarmovervies,
}))(Statistics);