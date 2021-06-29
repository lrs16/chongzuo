import { useEffect } from 'react';
import { queryCurrent } from '@/services/user';
import { queryUserRole } from '../../pages/SysManage/services/api'

function AdminAuth(props) {
  const { getAuth } = props;
  const getroleCode = (data) => {
    return data.filter(item => item.roleCode === 'admin')[0];
  };
  useEffect(() => {
    queryCurrent().then(res => {
      if (res.code === 200) {
        const userId = res.data.id;
        queryUserRole(userId).then(r => {
          if (r.code === 200) {
            const role = getroleCode(r.data);
            const auth = role === undefined ? '' : role.roleCode;
            getAuth(auth)
          }
        })
      }
    })
  }, [])
  return null;
}

export default AdminAuth;