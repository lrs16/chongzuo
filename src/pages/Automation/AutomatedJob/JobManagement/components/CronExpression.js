import React from 'react'
import {
    Input,
    InputNumber,
    Tabs,
    Radio,
    Checkbox,
    Row,
    Col
} from 'antd'

/**
 *CRON表达式生成器
 *@author Shellcoochi
 */
export default class CronGenerator extends React.Component {
    state = {
        cronText: '* * * * * *',
        cronType: ['second', 'minute', 'hour', 'day', 'month', 'week'],
        radioValue: {
            second: 1,
            minute: 1,
            hour: 1,
            day: 1,
            month: 1,
            week: 1
        },
        periodValue: {
            second: { max: 1, min: 1 },
            minute: { max: 1, min: 1 },
            hour: { max: 1, min: 1 },
            day: { max: 1, min: 1 },
            month: { max: 1, min: 1 },
            week: { max: 1, min: 1 }
        },
        loopValue: {
            second: { start: 1, end: 1 },
            minute: { start: 1, end: 1 },
            hour: { start: 1, end: 1 },
            day: { start: 1, end: 1 },
            month: { start: 1, end: 1 },
            week: { start: 1, end: 1 }
        },
        cron: {
            second: '*',
            minute: '*',
            hour: '*',
            day: '*',
            month: '*',
            week: '*'
        },
        cronParams: {
            second: '*',
            minute: '*',
            hour: '*',
            day: '*',
            month: '*',
            week: '*'
        }
    }

    /**
     * 生成cron
     * @returns {Promise<void>}
     */
    createCron = async () => {
        let { cronType } = this.state
        for (let type of cronType) {
            await this.cronGenerator(type)
        }
        let { second, minute, hour, day, month, week } = this.state.cron
        let cronText = second + ' ' + minute + ' ' + hour + ' ' + day + ' ' + month + ' ' + week
        this.setState({
            cronText: cronText
        })
        this.props.GetCronData(cronText);
    }

    /**
     * cron生成器
     * @param type
     */
    cronGenerator = (type) => {
        let srv = this.state.radioValue[type]
        let period = this.state.periodValue[type]
        let loop = this.state.loopValue[type]
        let param = this.state.cronParams[type]
        let data = ''
        switch (srv) {
            case 1: data = '*'; break
            case 2: data = '?'; break
            case 'point':
                for (let v of param) {
                    data = data + v + ','
                }
                data = data.substring(0, data.length - 1); break
            case 'period':
                data = period.min + '-' + period.max; break
            case 'loop':
                data = loop.start + '/' + loop.end; break
            default:
                data = '*'
        }
        this.setState({
            cron: Object.assign({}, this.state.cron, this.cronItemGenerator(type, data))
        })
    }

    /**
     * 对象生成器
     * @param type
     * @param data
     * @returns { {second: *}|{minute: *}}
     */
    cronItemGenerator = (type, data) => {
        switch (type) {
            case 'second': return { second: data }
            case 'minute': return { minute: data }
            case 'hour': return { hour: data }
            case 'day': return { day: data }
            case 'month': return { month: data }
            case 'week': return { week: data }
        }
    }

    /**
     * 生成多选框
     * @param col 每行个数
     * @param minNum 最小值
     * @param maxNum 最大值
     * @param key
     */
    createCheckbox = (key, col, minNum, maxNum) => {
        let colArray = []
        let rowArray = []
        let count = col
        let keyNum = minNum
        for (minNum; minNum <= maxNum; minNum++) {
            let checkbox = <Checkbox key={key + keyNum} value={minNum}>{this.formatNum(minNum)}</Checkbox>
            if (count > 0) {
                colArray.push(checkbox)
                count--
                if (minNum === maxNum) rowArray.push(<Col key={key + keyNum} span={24}>{colArray}</Col>)
            } else {
                rowArray.push(<Col key={key + keyNum} span={24}>{colArray}</Col>)
                colArray = []
                minNum--
                count = col
            }
            keyNum++
        }
        return <Row>{rowArray}</Row>
    }
    /**
     * 格式化0~9的数字
     * @param num
     */
    formatNum = (num) => {
        if (num < 10 && num > -1) {
            return '0' + num
        }
        return num
    }

    handleRadioChange = (e, type) => {
        this.setState({
            radioValue: Object.assign({}, this.state.radioValue, this.cronItemGenerator(type, e.target.value))
        })
    }

    handleCheckboxChange = (checkedValues, type) => {
        this.setState({
            cronParams: Object.assign({}, this.state.cronParams, this.cronItemGenerator(type, checkedValues))
        })
    }

    handlePeriodChange = (e, type, tar) => {
        let data = this.state.periodValue
        data[type] = tar === 'max' ? { max: e, min: data[type].min } : { max: data[type].max, min: e }
        this.setState({
            periodValue: Object.assign({}, this.state.periodValue, this.cronItemGenerator(type, data[type]))
        })
    }

    handleLoopChange = (e, type, tar) => {
        let data = this.state.loopValue
        data[type] = tar === 'start' ? { start: e, end: data[type].end } : { start: data[type].start, end: e }
        this.setState({
            loopValue: Object.assign({}, this.state.loopValue, this.cronItemGenerator(type, data[type]))
        })
    }

    render() {
        const { TabPane } = Tabs
        const { cronText, radioValue } = this.state
        const { Search } = Input
        const radioStyle = {
            display: 'block',
            height: '30px',
            lineHeight: '30px'
        }
        const secondCheckbox = this.createCheckbox('second', 10, 0, 59)
        const minuteCheckbox = this.createCheckbox('minute', 10, 0, 59)
        const hourCheckbox = this.createCheckbox('hour', 10, 0, 23)
        const dayCheckbox = this.createCheckbox('day', 10, 1, 31)
        const monthCheckbox = this.createCheckbox('month', 10, 1, 12)
        const weekCheckbox = this.createCheckbox('week', 7, 1, 7)
        console.log(secondCheckbox, 'secondCheckbox')

        return (
            <>
                <Tabs type='card' style={{ height: '300px', marginTop: '6px' }}>
                    <TabPane tab='秒' key='1'>
                        <Radio.Group
                            onChange={e => this.handleRadioChange(e, 'second')}
                            value={radioValue['second']}
                        >
                            <Radio style={radioStyle} value={1}>
                                每秒执行
                            </Radio>
                            <Radio style={radioStyle} value='period'>
                                周期从
                                <InputNumber
                                    size='small'
                                    min={1}
                                    max={59}
                                    defaultValue={1}
                                    onChange={e => this.handlePeriodChange(e, 'second', 'min')} />
                                -
                                <InputNumber
                                    size='small'
                                    min={1}
                                    max={59}
                                    defaultValue={1}
                                    onChange={e => this.handlePeriodChange(e, 'second', 'max')} />
                                秒
                            </Radio>
                            <Radio style={radioStyle} value='loop'>
                                从
                                <InputNumber
                                    size='small'
                                    min={1}
                                    max={59}
                                    defaultValue={1}
                                    onChange={e => this.handleLoopChange(e, 'second', 'start')} />
                                秒开始，每
                                <InputNumber
                                    size='small'
                                    min={1}
                                    max={59}
                                    defaultValue={1}
                                    onChange={e => this.handleLoopChange(e, 'second', 'end')}
                                />
                                秒执行一次
                            </Radio>
                            <Radio style={radioStyle} value='point'>
                                <Checkbox.Group
                                    style={{ width: '100%' }}
                                    onChange={e => this.handleCheckboxChange(e, 'second')}
                                >
                                    指定
                                    {secondCheckbox}
                                </Checkbox.Group>
                            </Radio>
                        </Radio.Group>
                    </TabPane>
                    <TabPane tab='分' key='2'>
                        <Radio.Group
                            value={radioValue['minute']}
                            onChange={e => this.handleRadioChange(e, 'minute')}
                        >
                            <Radio style={radioStyle} value={1}>
                                每分执行
                            </Radio>
                            <Radio style={radioStyle} value='period'>
                                周期从
                                <InputNumber
                                    size='small'
                                    min={1}
                                    max={59}
                                    defaultValue={1}
                                    onChange={e => this.handlePeriodChange(e, 'minute', 'min')} />
                                -
                                <InputNumber
                                    size='small'
                                    min={1}
                                    max={59}
                                    defaultValue={1}
                                    onChange={e => this.handlePeriodChange(e, 'minute', 'max')} />
                                分
                            </Radio>
                            <Radio style={radioStyle} value='loop'>
                                从
                                <InputNumber
                                    size='small'
                                    min={1}
                                    max={59}
                                    defaultValue={1}
                                    onChange={e => this.handleLoopChange(e, 'minute', 'start')} />
                                分开始，每
                                <InputNumber
                                    size='small'
                                    min={1}
                                    max={59}
                                    defaultValue={1}
                                    onChange={e => this.handleLoopChange(e, 'minute', 'end')} />
                                分执行一次
                            </Radio>
                            <Radio style={radioStyle} value='point'>
                                <Checkbox.Group
                                    style={{ width: '100%' }}
                                    onChange={e => this.handleCheckboxChange(e, 'minute')}>
                                    指定
                                    {minuteCheckbox}
                                </Checkbox.Group>
                            </Radio>
                        </Radio.Group>
                    </TabPane>
                    <TabPane tab='时' key='3'>
                        <Radio.Group
                            onChange={e => this.handleRadioChange(e, 'hour')}
                            value={radioValue['hour']}>
                            <Radio style={radioStyle} value={1}>
                                每小时执行
                            </Radio>
                            <Radio style={radioStyle} value='period'>
                                周期从
                                <InputNumber
                                    size='small'
                                    min={0}
                                    max={23}
                                    defaultValue={1}
                                    onChange={e => this.handlePeriodChange(e, 'hour', 'min')} />
                                -
                                <InputNumber
                                    size='small'
                                    min={0}
                                    max={23}
                                    defaultValue={1}
                                    onChange={e => this.handlePeriodChange(e, 'hour', 'max')} />
                                时
                            </Radio>
                            <Radio style={radioStyle} value='loop'>
                                从
                                <InputNumber
                                    size='small'
                                    min={0}
                                    max={23}
                                    defaultValue={1}
                                    onChange={e => this.handleLoopChange(e, 'hour', 'start')} />
                                时开始，每
                                <InputNumber
                                    size='small'
                                    min={1}
                                    max={59}
                                    defaultValue={1}
                                    onChange={e => this.handleLoopChange(e, 'hour', 'end')} />
                                时执行一次
                            </Radio>
                            <Radio style={radioStyle} value='point'>
                                <Checkbox.Group
                                    style={{ width: '100%' }}
                                    onChange={e => this.handleCheckboxChange(e, 'hour')}>
                                    指定
                                    {hourCheckbox}
                                </Checkbox.Group>
                            </Radio>
                        </Radio.Group>
                    </TabPane>
                    <TabPane tab='日' key='4'>
                        <Radio.Group
                            onChange={e => this.handleRadioChange(e, 'day')}
                            value={radioValue['day']}>
                            <Radio style={radioStyle} value={1}>
                                每日执行
                            </Radio>
                            <Radio style={radioStyle} value={2}>
                                不指定
                            </Radio>
                            <Radio style={radioStyle} value='period'>
                                周期从
                                <InputNumber
                                    size='small'
                                    min={1}
                                    max={31}
                                    defaultValue={1}
                                    onChange={e => this.handlePeriodChange(e, 'day', 'min')} />
                                -
                                <InputNumber
                                    size='small'
                                    min={1}
                                    max={31}
                                    defaultValue={1}
                                    onChange={e => this.handlePeriodChange(e, 'day', 'max')} />
                                日
                            </Radio>
                            <Radio style={radioStyle} value='loop'>
                                从
                                <InputNumber
                                    size='small'
                                    min={1}
                                    max={31}
                                    defaultValue={1}
                                    onChange={e => this.handleLoopChange(e, 'day', 'start')} />
                                日开始，每
                                <InputNumber
                                    size='small'
                                    min={1}
                                    max={31}
                                    defaultValue={1}
                                    onChange={e => this.handleLoopChange(e, 'day', 'end')} />
                                日执行一次
                            </Radio>
                            <Radio style={radioStyle} value='point'>
                                <Checkbox.Group
                                    style={{ width: '100%' }}
                                    onChange={e => this.handleCheckboxChange(e, 'day')}>
                                    指定
                                    {dayCheckbox}
                                </Checkbox.Group>
                            </Radio>
                        </Radio.Group>
                    </TabPane>
                    <TabPane tab='月' key='5'>
                        <Radio.Group
                            onChange={e => this.handleRadioChange(e, 'month')}
                            value={radioValue['month']}>
                            <Radio style={radioStyle} value={1}>
                                每月执行
                            </Radio>
                            <Radio style={radioStyle} value={2}>
                                不指定
                            </Radio>
                            <Radio style={radioStyle} value='period'>
                                周期从
                                <InputNumber
                                    size='small'
                                    min={1}
                                    max={12}
                                    defaultValue={1}
                                    onChange={e => this.handlePeriodChange(e, 'month', 'min')} />
                                -
                                <InputNumber
                                    size='small'
                                    min={1}
                                    max={12}
                                    defaultValue={1}
                                    onChange={e => this.handlePeriodChange(e, 'month', 'max')} />
                                月
                            </Radio>
                            <Radio style={radioStyle} value='loop'>
                                从
                                <InputNumber
                                    size='small'
                                    min={1}
                                    max={12}
                                    defaultValue={1}
                                    onChange={e => this.handleLoopChange(e, 'month', 'start')} />
                                月开始，每
                                <InputNumber
                                    size='small'
                                    min={1}
                                    max={12}
                                    defaultValue={1}
                                    onChange={e => this.handleLoopChange(e, 'month', 'end')} />
                                月执行一次
                            </Radio>
                            <Radio style={radioStyle} value='point'>
                                <Checkbox.Group style={{ width: '100%' }} onChange={e => this.handleCheckboxChange(e, 'month')}>
                                    指定
                                    {monthCheckbox}
                                </Checkbox.Group>
                            </Radio>
                        </Radio.Group>
                    </TabPane>
                    <TabPane tab='周' key='6'>
                        <Radio.Group
                            onChange={e => this.handleRadioChange(e, 'week')}
                            value={radioValue['week']}>
                            <Radio style={radioStyle} value={1}>
                                每周执行
                            </Radio>
                            <Radio style={radioStyle} value={2}>
                                不指定
                            </Radio>
                            <Radio style={radioStyle} value='period'>
                                周期从 周
                                <InputNumber
                                    size='small'
                                    min={1}
                                    max={7}
                                    defaultValue={1}
                                    onChange={e => this.handlePeriodChange(e, 'week', 'min')} />
                                - 周
                                <InputNumber
                                    size='small'
                                    min={1}
                                    max={7}
                                    defaultValue={1}
                                    onChange={e => this.handlePeriodChange(e, 'week', 'max')} />
                            </Radio>
                            <Radio style={radioStyle} value='point'>
                                <Checkbox.Group
                                    style={{ width: '100%' }}
                                    onChange={e => this.handleCheckboxChange(e, 'week')}>
                                    指定
                                    {weekCheckbox}
                                </Checkbox.Group>
                            </Radio>
                        </Radio.Group>
                    </TabPane>
                </Tabs>
                <Search
                    placeholder='生成Cron'
                    enterButton='生成'
                    style={{ width: 400, margin: '20px 0 18px' }}
                    onSearch={this.createCron}
                    value={cronText}
                />
            </>
        )
    }
}