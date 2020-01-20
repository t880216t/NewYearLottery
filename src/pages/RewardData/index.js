import React,{ Component } from 'react';
import { Button, Modal, Table, Form, Input, InputNumber, Card, Divider } from 'antd';
import { connect } from 'dva'
import router from 'umi/router'

import styles from './index.less'

@connect(({ lottery }) => ({
  lottery
}))
@Form.create()
class Index extends Component{
  // 构造
    constructor(props) {
      super(props);
      // 初始状态
      this.state = {
        rewardData: [],
        visibleModal: false,
        rewardInfo: null,
      };
    }

  componentWillMount() {
    this.props.dispatch({
      type: "lottery/init"
    })
      .then(() => {
        const { rewardData } = this.props.lottery
        this.setState({ rewardData })
      })
  }

  handleOk = () => {
    const { form } = this.props;
    const { rewardInfo } = this.state;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      if (rewardInfo) {
        this.handleEditOk(fieldsValue)
      } else {
        this.handleAddOk(fieldsValue);
      }
    });
  }

  handleEdit = (record) => {
      this.setState({rewardInfo: record, visibleModal: true,})
  }

  handleDelete = id => {
    this.props.dispatch({
      type: 'lottery/deleteReward',
      payload: { id }
    })
      .then(() => {
        const { rewardData } = this.props.lottery
        this.setState({ rewardData, })
      })
  }

  handleEditOk = fieldsValue => {
    const { rewardInfo } = this.state;
    this.props.dispatch({
      type: 'lottery/editReward',
      payload: { ...fieldsValue, id: rewardInfo.id}
    })
      .then(() => {
        const { rewardData } = this.props.lottery
        this.setState({ rewardData, visibleModal: false, rewardInfo: null })
      })
  }

  handleAddOk = fieldsValue => {
    this.props.dispatch({
      type: 'lottery/addReward',
      payload: fieldsValue
    })
      .then(() => {
        const { rewardData } = this.props.lottery
        this.setState({ rewardData, visibleModal: false, })
      })
  }

  handleCancel = () => {
      this.setState({
        visibleModal: false,
      })
  }

    render(){
      const { getFieldDecorator } = this.props.form;
      const { rewardData, rewardInfo } = this.state;
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
          width: '20%'
        },
        {
          title: '名称',
          dataIndex: 'name',
          key: 'name',
          width: '20%',
          render: (text,record) => (
            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              {record.name}
            </div>
          )
        },
        {
          title: '数量',
          dataIndex: 'rewardCount',
          key: 'rewardCount',
          width: '20%'
        },
        {
          title: '权重',
          dataIndex: 'weight',
          key: 'weight',
          width: '20%',
          sorter: (a, b) => a.weight - b.weight,
          // sortOrder: 'descend',
        },
        {
          title: '操作',
          dataIndex: 'action',
          key: 'action',
          width: '20%',
          render: (text, record) => (
            <div>
              <a onClick={() => this.handleEdit(record)}>编辑</a>
              <Divider type="vertical" />
              <a onClick={() => this.handleDelete(record.id)}>删除</a>
            </div>
          )
        }
      ];
      return <div style={{display: 'flex', justifyContent: 'center', alignItems:'center'}}>
        <Card className={styles.container}>
          <div className={styles.actionContainer}>
            <Button icon="left" onClick={()=>router.replace('/')} >返回首页</Button>
            <Button icon="plus" type="primary" onClick={()=>this.setState({visibleModal: true})}>新增奖品</Button>
          </div>
          <Table
            bordered
            pagination={{
              pageSize: 50
            }}
            scroll={{ y: 550}}
            dataSource={rewardData}
            rowKey={record => record.id}
            columns={columns}
          />
        </Card>
        <Modal
          title={rewardInfo?"编辑奖品":"添加奖品"}
          visible={this.state.visibleModal}
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
                initialValue: rewardInfo? rewardInfo.name: undefined,
              })(<Input />)}
            </Form.Item>
            <Form.Item label="数量">
              {getFieldDecorator('rewardCount', {
                rules: [
                  {
                    required: true,
                    message: '请输入数量！',
                  },
                ],
                initialValue: rewardInfo? rewardInfo.rewardCount: undefined,
              })(<InputNumber />)}
            </Form.Item>
            <Form.Item label="权重">
              {getFieldDecorator('weight', {
                rules: [
                  {
                    required: true,
                    message: '请输入权重！',
                  },
                ],
                initialValue: rewardInfo? rewardInfo.weight: 1,
              })(<InputNumber step={1} max={10} min={1} />)}
            </Form.Item>
          </Form>
        </Modal>
      </div>
    }
}
export default Index;
