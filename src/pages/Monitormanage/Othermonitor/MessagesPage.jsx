import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import { Card, Select } from 'antd';
import GroupedColumn from '@/components/CustomizeCharts/GroupedColumn';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { querkeyVal } from '@/services/api';

const { Option } = Select;

function MessagesPage(props) {
  const { dispatch, messagechart } = props;
  const pagetitle = props.route.name;
  const [gddwbh, setGddwbh] = useState({});
  const [selectdata, setSelectdata] = useState([]);
  const [scale, setScale] = useState({ value: { min: 0, max: 10, alias: '连续报文数（次）' }, alertvalue: { min: 0, max: 10, alias: '警戒值' } });

  const maxvalue = (datas) => {
    let max = 10;
    if (!Array.isArray(datas)) {
      return max;
    }
    for (let i = 0; i < datas.length; i += 1) {
      const cursx = Number(datas[i].sxcs);
      const curxx = Number(datas[i].xxcs);
      const cur = cursx > curxx ? cursx : curxx;
      max = cur > max ? cur : max;
    }
    return max
  }

  const changeArrdata = (datas) => {
    const newArr = [];
    if (!Array.isArray(datas)) {
      return newArr;
    }
    for (let i = 0; i < datas.length; i += 1) {
      const votesx = {};
      votesx.type = datas[i].zddz;
      votesx.name = '上行报文';
      votesx.value = datas[i].sxcs;
      votesx.alertvalue = datas[i].jjz;
      const votexx = {};
      votexx.type = datas[i].zddz;
      votexx.name = '下行报文';
      votexx.value = datas[i].xxcs;
      votexx.alertvalue = datas[i].jjz;
      newArr.push(votesx);
      newArr.push(votexx);
    }
    return newArr;
  }

  const onChange = (val) => {
    setGddwbh(val);
    dispatch({
      type: 'orthermonitor/fetchmessagechart',
      payload: {
        gddwbh: val.key,
      },
    });
  };

  useEffect(() => {
    querkeyVal('system', 'company').then(res => {
      if (res.code === 200) {
        setSelectdata(res.data.company)
      }
    })
    onChange({ key: '0401', label: '南宁供电局' })
  }, []);

  useEffect(() => {
    if (messagechart && messagechart.packets && messagechart.packets.length > 0) {
      const max = maxvalue(messagechart.packets);
      const sca = {
        value: {
          min: 0,
          max,
          alias: '连续报文数（次）',
        },
        alertvalue: {
          min: 0,
          max,
          alias: '警戒值',
        },
      };
      setScale(sca)
    }
  }, [messagechart])

  return (
    <PageHeaderWrapper title={pagetitle}>
      <Card>
        <div style={{ marginBottom: 24 }}>
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="输入关键字可搜索"
            optionFilterProp="children"
            onChange={onChange}
            filterOption={(input, option) =>
              option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            labelInValue
            defaultValue={{ key: '0401', label: '南宁供电局' }}
          >

            {selectdata.map(obj => [
              <Option value={obj.key}>{obj.val}</Option>
            ])}
          </Select>
          <span style={{ marginLeft: 48 }}>监测时间：{messagechart.kssj}--{messagechart.jssj}</span>
        </div>
        {messagechart && messagechart.packets && (
          <GroupedColumn
            height={350}
            padding={[30, 10, 60, 60]}
            data={changeArrdata(messagechart.packets)}
            scale={scale}
          />)}
      </Card>
    </PageHeaderWrapper>
  );
}

export default connect(({ orthermonitor, loading }) => ({
  messagechart: orthermonitor.messagechart,
  chartloading: loading.models.orthermonitor,
}))(MessagesPage);