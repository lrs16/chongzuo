import React, { useRef, useImperativeHandle } from 'react';
import {
    Radio
} from 'antd';
import DescriptionList from '@/components/DescriptionList';

const { Description } = DescriptionList;
const RadioGroup = Radio.Group;

// const reportmap = new Map([
//     [0, '是'],
//     [1, '否'],
//   ]);

const ExamineSecondQuery = React.forwardRef((props, ref) => {
    const { detailsdata } = props;
    const attRef = useRef();
    useImperativeHandle(
        ref,
        () => ({
            attRef,
        }),
        [],
    );
    return (
        <div style={{ paddingLeft: 45, paddingTop: 10 }}>
            {
                detailsdata !== undefined && (
                    <>
                        <DescriptionList size="large">
                            <Description term="审核结果">
                                <RadioGroup defaultValue={Number(detailsdata.checkResult)} disabled>
                                    <Radio value={0}>通过</Radio>
                                    <Radio value={1}>不通过</Radio>
                                </RadioGroup>
                            </Description>
                        </DescriptionList>
                        <DescriptionList size="large">
                            <Description term="审核时间">{detailsdata.checkTime || ''}</Description>
                        </DescriptionList>
                        <DescriptionList size="large">
                            <Description term="审核意见">{detailsdata.checkOpinion || ''}</Description>
                        </DescriptionList>
                        <DescriptionList size="large">
                            <Description term="上传附件">XXXX附件.doc</Description>
                        </DescriptionList>
                        <DescriptionList size="large">
                            <Description term="审核人">{detailsdata.checkUser || ''}</Description>
                            <Description term="审核人单位">{detailsdata.checkUnit || ''}</Description>
                            <Description term="审核人部门">{detailsdata.checkDept || ''}</Description>
                        </DescriptionList>
                    </>
                )
            }
        </div>
    );
});

export default ExamineSecondQuery;
