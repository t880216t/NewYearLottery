import React, { Component } from 'react';
import { Button, Upload, Table, message, Input, InputNumber, Card, Divider, Modal, Form } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import * as XLSX from 'xlsx';

import styles from './index.less';

@connect(({ lottery }) => ({
  lottery,
}))
@Form.create()
class Index extends Component {
  // 构造
  constructor(props) {
    super(props);
    // 初始状态
    this.state = {
      userData: [],
      visibleModal: false,
    };
  }

  componentWillMount() {
    this.props.dispatch({
      type: 'lottery/init',
    })
      .then(() => {
        const { userData } = this.props.lottery;
        this.setState({ userData });
      });
  }

  handleUploadData = (file, fileList) => {
    const fileReader = new FileReader();
    fileReader.onload = event => {
      try {
        const { result } = event.target;
        const workbook = XLSX.read(result, { type: 'binary' });
        let data = [];
        for (const sheet in workbook.Sheets) {
          if (workbook.Sheets.hasOwnProperty(sheet)) {
            data = data.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
          }
        }
        sessionStorage.setItem('userData', JSON.stringify(data));
        this.setState({
          userData: data,
        });
        message.success('数据保存成功');
      } catch (e) {
        console.log('文件类型不正确', e);
        return;
      }
    };
    fileReader.readAsBinaryString(file);
  };

  handleDelete = id => {
    console.log('xxx',id)
    this.props.dispatch({
      type: 'lottery/deleteUser',
      payload: { id },
    })
      .then(() => {
        const { userData } = this.props.lottery;
        this.setState({ userData });
      });
  };

  handleEdit = (record) => {
    this.setState({ userInfo: record, visibleModal: true });
  };

  handleOk = () => {
    const { form } = this.props;
    const { userInfo } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      if (userInfo) {
        this.handleEditOk(fieldsValue);
      }
    });
  };

  handleEditOk = fieldsValue => {
    const { userInfo } = this.state;
    this.props.dispatch({
      type: 'lottery/editUser',
      payload: { ...fieldsValue, id: userInfo.id },
    })
      .then(() => {
        const { userData } = this.props.lottery;
        this.setState({ userData, visibleModal: false, userInfo: null });
      });
  };

  handleCancel = () => {
    this.setState({
      visibleModal: false,
      userInfo: null,
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { userData, userInfo, visibleModal } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const columns = [
      {
        title: 'Id',
        dataIndex: 'id',
        key: 'id',
        width: '25%',
      },
      {
        title: '名字',
        dataIndex: 'name',
        key: 'name',
        width: '25%',
        render: (text, record) => (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {record.name}
          </div>
        ),
      },
      {
        title: '权重',
        dataIndex: 'weight',
        key: 'weight',
        width: '25%',
        sorter: (a, b) => a.weight - b.weight,
        // sortOrder: 'descend',
      },
      {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        width: '25%',
        render: (text, record) => (
          <div>
            <a onClick={() => this.handleEdit(record)}>编辑</a>
            <Divider type="vertical"/>
            <a onClick={() => this.handleDelete(record.id)}>删除</a>
          </div>
        ),
      },
    ];
    const props = {
      name: 'file',
      accept: '.xlsx, .xls',
      showUploadList: false,
      beforeUpload: (file, fileList) => this.handleUploadData(file, fileList),
    };
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Card className={styles.container}>
          <div className={styles.actionContainer}>
            <Button icon="left" onClick={() => router.replace('/')}>返回首页</Button>
            <Upload {...props}>
              <Button icon="upload" type="primary">上传表单</Button>
            </Upload>
          </div>
          <Table
            bordered
            pagination={{
              pageSize: 50,
            }}
            scroll={{ y: 550 }}
            dataSource={userData}
            rowKey={record => record.id}
            columns={columns}
          />
        </Card>
        <Modal
          title={userInfo ? '编辑奖品' : '添加奖品'}
          visible={visibleModal}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          // width={820}
        >
          <Form {...formItemLayout}>
            <Form.Item label="名称">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请输入用户名称！',
                  },
                ],
                initialValue: userInfo ? userInfo.name : undefined,
              })(<Input/>)}
            </Form.Item>
            <Form.Item label="权重">
              {getFieldDecorator('weight', {
                rules: [
                  {
                    required: true,
                    message: '请输入权重！',
                  },
                ],
                initialValue: userInfo ? userInfo.weight : 1,
              })(<InputNumber step={1} max={10} min={0}/>)}
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Index;
