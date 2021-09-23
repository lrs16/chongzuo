import React from 'react';
import { connect } from 'dva';
import { Drawer, Button, Form, Input } from 'antd';

const { TextArea } = Input;

function PatrolBriefDrawer(props) {
    const {
        visible,
        ChangeVisible,
        title, } = props;

    const hanldleCancel = () => {
        ChangeVisible(false);
    };

    const handleOk = () => {
        // 关闭弹窗
        hanldleCancel();
        // 传数据
        // handleSubmit(values);
        ChangeVisible(false);
    };

    const aa = `早班情况报送【8月11日08:00，值班人员：吴一鸣（主值）、林立昆（副值）】

    一、系统运行情况： 
   
   （1）29web、30web、234web登录正常；终端在线率97.28%；  自动抄表率97.91%
   
   （统调电厂99.17%、地方电厂98.1%、变电站99.9%、专变96.69%、公变99.31%、
   
   低压97.9%）。 
   
   （2）总入库数：15196230 
   
   （3）厂站入库数：23771+7688（其中13规约7688）
   
   （4）通道完好率：92.11% 
   
   二、机房基础环境及软硬件巡视情况情况：
   
     1、机房基础环境： 
   
   （1）无异常。
   
    2、硬件及操作系统运行情况
   
    （1）无异常。
   
    三、数据库监控情况 
   
   （1）三区生产库：正常 
   
   （2）三区历史库：正常 
   
   （3）二区数据库：正常 
   
   （4）三区生产库与历史库同步状态正常
   
    四、安全情况：总体情况正常。 
   
   （1）IPS监控总体正常，遭受外网攻击次数0次，发生攻击成功事件0起。
   
     五、影响业务的软硬件故障记录 
   
   （1）2021年8月11日7时00分，值班员发现计量自动化分析系统（10.172.209.145）
   
   web异常，低压入库数据无法显示，待处理。`;

    return (
        <Drawer
            title={title}
            width="55%"
            onClose={hanldleCancel}
            visible={visible}
            bodyStyle={{ paddingBottom: 60 }}
        >
            <h4>简报内容</h4>
            <TextArea autoSize={{ minRows: 30 }} defaultValue={aa} />
            <div
                style={{
                    position: 'absolute',
                    right: 0,
                    bottom: 0,
                    width: '100%',
                    borderTop: '1px solid #e9e9e9',
                    padding: '10px 16px',
                    background: '#fff',
                    textAlign: 'right',
                }}
            >
                <Button onClick={() => hanldleCancel()} style={{ marginRight: 8 }}>
                    取消
                </Button>
                <Button onClick={() => handleOk()} type="primary">
                    下载简报
                </Button>
            </div>
        </Drawer>
    );
}

export default Form.create({})(
    connect(({ autotask, loading }) => ({
        taskobjectlist: autotask.taskobjectlist,
        loading: loading.models.autotask,
    }))(PatrolBriefDrawer),
);