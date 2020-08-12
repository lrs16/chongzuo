import React, { Component } from 'react';
import { Button, DatePicker, Modal } from 'antd';

const ButtonGroup = Button.Group;
const { RangePicker } = DatePicker;

class Time extends Component {
  state = { visible: false };

  onChange = (value, dateString) => {
    console.log('Selected Time: ', value);
    console.log('Formatted Selected Time: ', dateString);
  };

  onOk = value => {
    console.log('onOk: ', value);
  };

  render() {
    return (
      <div>
        <RangePicker
          showTime={{ format: 'HH:mm' }}
          format="YYYY-MM-DD HH:mm"
          placeholder={['开始时间', '结束时间']}
          onChange={this.onChange}
          onOk={this.onOk}
        />
        <div>
          <Button type="primary" style={{ marginRight: '12px' }}>
            自定义
          </Button>
          <Button type="primary" style={{ marginRight: '12px' }}>
            最近一次
          </Button>
          <ButtonGroup style={{ marginRight: '12px' }}>
            <Button>30分钟</Button>
            <Button>1小时</Button>
            <Button>6小时</Button>
            <Button>12小时</Button>
            <Button>1天</Button>
            <Button>3天</Button>
            <Button>7天</Button>
            <Button>1月</Button>
          </ButtonGroup>
        </div>
      </div>
    );
  }
}

export default Time;
