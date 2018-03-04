import { Avatar, Table } from 'antd';
import { ColumnProps } from 'antd/es/table';
import React from 'react';
import { IMemberState } from '../../../../stores/Course/members';

export const columns: Array<ColumnProps<IMemberState>> = [
  {
    key: 'id',
    title: '用户ID',
    dataIndex: 'user_id'
  },
  {
    key: 'nickname',
    title: '昵称',
    dataIndex: 'nickname',
    render: (nickname, { username }) => (
      <div>
        <Avatar
          icon={ 'user' }
          src={ `/api/users/profile/avatar?username=${username}` }
          style={ { marginRight: '1rem' } }
        />
        <span>{ nickname }</span>
      </div>
    )
  },
  {
    key: 'realname',
    title: '姓名',
    dataIndex: 'realname'
  },
  {
    key: 'email',
    title: '邮箱',
    dataIndex: 'email'
  }
];

export const studentColumns: Array<ColumnProps<IMemberState>> = [ ...columns, {
  key: 'student_id',
  title: '学号',
  dataIndex: 'student_id'
}];

export default class MembersTable extends Table<IMemberState> { }
