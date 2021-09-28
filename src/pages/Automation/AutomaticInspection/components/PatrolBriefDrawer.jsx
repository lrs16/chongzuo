import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Drawer, Button, Form, message } from 'antd';
import { openhostBriefing, saveBriefing, downloadBriefing } from '../services/api';

// const { TextArea } = Input;

function PatrolBriefDrawer(props) {
    const {
        visible,
        ChangeVisible,
        Id,
        title,
        // dispatch,
    } = props;

    const [brierInfo, setBrierInfo] = useState('');

    // 打开简报
    useEffect(() => {
        if (Id) {
            openhostBriefing(Id).then(resp => {
                if (resp.code === 200) {
                    setBrierInfo(resp.msg);
                } else {
                    message.error(resp.msg);
                }
            });
        }
    }, [Id])

    const hanldleCancel = () => {
        ChangeVisible(false);
    };

    const handleOk = () => { // 下载简报
        saveBriefing({ briefing: brierInfo, id: Id }).then(res => {
            if (res.code === 200) {
                downloadBriefing(Id).then(resp => {
                    const filename = `简报下载_${Id}.txt`;
                    const blob = new Blob([resp]);
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = filename;
                    a.click();
                    window.URL.revokeObjectURL(url);
                })
            }
        });
        // 关闭弹窗
        hanldleCancel();
        ChangeVisible(false);
    };

    const htmlbrierInfo = brierInfo;

    return (
        <Drawer
            title={title}
            width="55%"
            onClose={hanldleCancel}
            visible={visible}
            bodyStyle={{ paddingBottom: 60 }}
        >
            <h4>简报内容</h4>
            <div dangerouslySetInnerHTML={{ __html: htmlbrierInfo?.replace(/[\n]/g, '<br/>') }}
                style={{
                    width: "100%",
                    height: "100%",
                    borderWidth: 1,
                    borderStyle: 'solid',
                    borderColor: 'rgba(233, 233, 233, 1)',
                    padding: ' 15px 50px 100px 15px'
                }}
            />
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
    connect(({ automation, loading }) => ({
        info: automation.info,
        loading: loading.models.automation,
    }))(PatrolBriefDrawer),
);