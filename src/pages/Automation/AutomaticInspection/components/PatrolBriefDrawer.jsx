import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { Drawer, Button, Form, message, Input } from 'antd';
import { openhostBriefing, saveBriefing, downloadBriefing } from '../services/api';

const { TextArea } = Input;

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

    const hanldleCancel = () => { // 取消
        ChangeVisible(false);
    };

    const hanldleSave = () => { // 保存
        saveBriefing({ briefing: brierInfo, id: Id }).then(res => {
            if (res.code === 200) {
                message.success(res.msg);
            } else {
                message.error(res.msg);
            }
        });
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

    const handleChange = e => {
        setBrierInfo(e.target.value);
    }

    return (
        <Drawer
            title={title}
            width="55%"
            onClose={hanldleCancel}
            visible={visible}
            bodyStyle={{ paddingBottom: 60 }}
        >
            <h4>简报内容</h4>
            {brierInfo && (
                <TextArea autoSize={{ minRows: 50 }} defaultValue={brierInfo} onChange={handleChange} />
            )}
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
                <Button onClick={() => hanldleSave()} style={{ marginRight: 8 }} type="primary">
                    保存
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