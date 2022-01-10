/* eslint-disable prettier/prettier */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable global-require */
// eslint-disable-next-line prettier/prettier
/* eslint-disable react/no-unused-state */
/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import React, { Component } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Input from '@material-tailwind/react/Input';
import Textarea from '@material-tailwind/react/Textarea';
import { Form, Button, Select, Row, Col, Divider, Image, Modal } from 'antd';
import PropTypes from 'prop-types';
// const { TextArea } = Input;
const { Option } = Select;
export default class EditMemberComponent extends Component {
  constructor(props) {
    super(props);
    // console.log(props)
    this.state = {
      fileCard: [],
      filepreviewCard: null,
      fileBookBank: [],
      filepreviewBookBank: null,

      setOldNamefileCard: null,
      setOldNamefileBookBank: null,

      setShowModalCode: false,
      editUserId: null,
      userId: '',
      password: null,
      email: null,
      firstname: null,
      lastname: null,
      tel: null,
      bookname: null,
      booknumber: null,
      role: null,
      address: null,
      subdistrict: null,
      district: null,
      province: null,
      map: null,
      status: null,
      level: null,
      id: null,
      disabledButton: true,
      ApiProvinces: [],
      ApiAmphure: [],
      ApiTombon: [],

      ApiProvinceId: null,
      ApiAmphureId: null,
      ApiTombonId: null
    };
  }

  handleInputChangeCard = async (event) => {
    this.setState({
      fileCard: event.target.files[0],
      filepreviewCard: URL.createObjectURL(event.target.files[0])
    });
  };

  handleInputChangeBookBank = async (event) => {
    this.setState({
      fileBookBank: event.target.files[0],
      filepreviewBookBank: URL.createObjectURL(event.target.files[0])
    });
  };

  componentDidMount = async () => {
    const getApiProvinces = await axios.get(
      'https://codebee.co.th/labs/examples/autoprovince/json/provinces.json'
    );
    const getApiAmphure = await axios.get(
      'https://codebee.co.th/labs/examples/autoprovince/json/amphures.json'
    );
    const getApiTombon = await axios.get(
      'https://codebee.co.th/labs/examples/autoprovince/json/districts.json'
    );
    // console.log(getApiTombon.data)
    const results = await axios.get(
      `http://localhost:8000/member/${localStorage.getItem('editUserId')}`
    );

    console.log(results.data.data);
    this.setState({
      editUserId: localStorage.getItem('editUserId'),
      id: results.data.data.id,
      userId: results.data.data.userId,
      password: results.data.data.password,
      email: results.data.data.email,
      firstname: results.data.data.firstname,
      lastname: results.data.data.lastname,
      tel: results.data.data.tel,
      bookname: results.data.data.bookname,
      booknumber: results.data.data.booknumber,
      role: results.data.data.role,
      address: results.data.data.address,
      subdistrict: results.data.data.subdistrict,
      district: results.data.data.district,
      province: results.data.data.province,
      map: results.data.data.map,
      status: results.data.data.status,
      level: results.data.data.level,
      // eslint-disable-next-line import/no-dynamic-require
      filepreviewBookBank: require(`../../../../assets/img/${results.data.data.bookBankImg}`).default,
      // eslint-disable-next-line import/no-dynamic-require
      filepreviewCard: require(`../../../../assets/img/${results.data.data.cardImg}`).default,
      setOldNamefileCard: results.data.data.cardImg,
      setOldNamefileBookBank: results.data.data.bookBankImg,

      ApiProvinces: getApiProvinces.data,
      ApiAmphure: getApiAmphure.data,
      ApiTombon: getApiTombon.data
    });
  };
  // componentDidMount = async () => {};

  onChangeProvince = (res) => {
    console.log(res);
    if (res === null) {
      this.setState({ province: localStorage.getItem('province') });
    } else if (res !== null) {
      const resProvice = this.state.ApiProvinces.filter((e) => e.province_id === res);
      this.setState({ province: resProvice[0].province_name });
    }
    this.setState({ ApiProvinceId: res });
  };

  onChangeDistrict = (res) => {
    console.log(res);
    if (res === null) {
      this.setState({ district: localStorage.getItem('district') });
    } else if (res !== null) {
      const resProvice = this.state.ApiAmphure.filter((e) => e.amphur_id === res);
      this.setState({ district: resProvice[0].amphur_name });
    }
    this.setState({ ApiAmphureId: res });
  };

  onChangeSubDistrict = (res) => {
    console.log(res);
    if (res === null) {
      this.setState({ district: localStorage.getItem('district') });
    } else if (res !== null) {
      const resProvice = this.state.ApiTombon.filter((e) => e.district_id === res);
      console.log(resProvice[0].district_name);
      this.setState({ subdistrict: resProvice[0].district_name });
    }
    this.setState({ ApiTombonId: res });
  };

  submit = async () => {
    if (this.state.ApiAmphureId === null) {
      this.setState({ district: localStorage.getItem('district') });
    }
    if (this.state.ApiTombonId === null) {
      this.setState({ subdistrict: localStorage.getItem('subdistrict') });
    }
    console.log(this.state.province);
    if (this.state.disabledButton === true) {
      const results = {
        userId: this.state.userId,
        password: this.state.password,
        email: this.state.email,
        firstname: this.state.firstname,
        lastname: this.state.lastname,
        tel: this.state.tel,
        bookname: this.state.bookname,
        booknumber: this.state.booknumber,
        role: this.state.role,
        address: this.state.address,
        subdistrict: this.state.subdistrict,
        district: this.state.district,
        province: this.state.province,
        map: this.state.map,
        level: this.state.level,
        status: this.state.status,
        showModalSubmit: false
      };

      await axios
        .put('http://localhost:8000/member/', results)
        .then((response) => {
          console.log('response: ', response);
          // do something about response
        })
        .catch((err) => {
          console.error(err);
        });
    } else if (this.state.disabledButton === false) {
      // this.deleteMemberById()
      const formdata = new FormData();
      formdata.append('cardImg', this.state.fileCard);
      formdata.append('bookBankImg', this.state.fileBookBank);
      formdata.append('userId', this.state.userId);
      formdata.append('password', this.state.password);
      formdata.append('email', this.state.email);
      formdata.append('firstname', this.state.firstname);
      formdata.append('lastname', this.state.lastname);
      formdata.append('tel', this.state.tel);
      formdata.append('bookname', this.state.bookname);
      formdata.append('booknumber', this.state.booknumber);
      formdata.append('role', this.state.role);
      formdata.append('address', this.state.address);
      formdata.append('subdistrict', this.state.subdistrict);
      formdata.append('district', this.state.district);
      formdata.append('province', this.state.province);
      formdata.append('map', this.state.map);
      formdata.append('status', this.state.status);
      formdata.append('level', this.state.level);
      await axios
        .post('http://localhost:8000/member', formdata, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then((res) => {
          console.warn(res);
        });

      this.deleteMemberById();
    } else {
      console.log('Error');
    }
    window.localStorage.clear();
    window.history.back();
  };

  deleteMemberById = async () => {
    await axios.delete(`http://localhost:8000/deleteimage/${this.state.setOldNamefileBookBank}`);
    await axios.delete(`http://localhost:8000/deleteimage/${this.state.setOldNamefileCard}`);
    await axios.delete(`http://localhost:8000/memberId/${this.state.id}`);
  };

  render() {
    console.log(this.state.ApiProvinceId);
    // console.log(this.props.location.aboutProps)
    return (
      <>
        <div>
          <Divider orientation="left">แก้ไขข้อมูลผู้ใช้</Divider>
          <Form>
            {' '}
            <Row justify="space-around">
              <Col span={8}>
                เลขบัตรประจำตัวประชาชน
                <Input
                  disabled
                  defaultValue={this.state.userId}
                  onChange={(e) => this.setState({ userId: e.target.value })}
                />{' '}
                <br />
                <br />
                password
                <Input
                  defaultValue={this.state.password}
                  onChange={(e) => this.setState({ password: e.target.value })}
                />{' '}
                <br />
                <br />
                E-mail
                <Input
                  defaultValue={this.state.email}
                  onChange={(e) => this.setState({ email: e.target.value })}
                />{' '}
                <br />
                <br />
                ชื่อ
                <Input
                  defaultValue={this.state.firstname}
                  onChange={(e) => this.setState({ firstname: e.target.value })}
                />{' '}
                <br />
                <br />
                นามสกุล
                <Input
                  defaultValue={this.state.lastname}
                  onChange={(e) => this.setState({ lastname: e.target.value })}
                />{' '}
                <br />
                <br />
                เบอร์โทรศัพท์
                <Input
                  defaultValue={this.state.tel}
                  onChange={(e) => this.setState({ tel: e.target.value })}
                />{' '}
                <br />
                <br />
                ชื่อบัญชีธนาคาร
                <Input
                  defaultValue={this.state.bookname}
                  onChange={(e) => this.setState({ bookname: e.target.value })}
                />{' '}
                <br />
                <br />
                เลขบัญชีธนาคาร
                <Input
                  defaultValue={this.state.booknumber}
                  onChange={(e) => this.setState({ booknumber: e.target.value })}
                />{' '}
                <br />
                <br />
                Role :
                <Select
                  defaultValue={localStorage.getItem('role')}
                  allowClear
                  onChange={(value) => this.setState({ role: value })}
                >
                  <Option value="Member">Member</Option>
                  <Option value="Admin">Admin</Option>
                </Select>{' '}
                <br />
                <br />
                <br />
                <br />
                {this.state.disabledButton ? null : (
                  <>
                    <a> เลือกรูปบัตรประจำตัวประชาขน </a>
                    <input
                      disabled={this.state.disabledButton}
                      type="file"
                      className="form-control"
                      name="upload_file"
                      //  defaultValue = {this.state.productImg}
                      onChange={this.handleInputChangeCard}
                    />
                  </>
                )}
                {this.state.filepreviewCard !== null ? (
                  <Image
                    className="previewimg"
                    src={this.state.filepreviewCard}
                    alt="UploadImage"
                  />
                ) : null}
              </Col>
              <Col span={8}>
                ที่อยู่
                <Input
                  defaultValue={this.state.address}
                  onChange={(e) => this.setState({ address: e.target.value })}
                />{' '}
                <br />
                <br />
                <Form.Item
                  name="province"
                  label="จังหวัด"
                  rules={[
                    {
                      required: true
                    }
                  ]}
                >
                  <Select
                    // onChange= {(e) => console.log(e)}
                    onChange={(e) => this.onChangeProvince(e)}
                    showSearch
                    defaultValue={localStorage.getItem('province')}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    filterSort={(optionA, optionB) =>
                      optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                    }
                    allowClear
                  >
                    {this.state.ApiProvinces.map((a) => (
                      <Option value={a.province_id}>{a.province_name}</Option>
                    ))}
                  </Select>
                </Form.Item>
                <br />
                <br />
                <Form.Item
                  name="district"
                  label="อำเภอ"
                  rules={[
                    {
                      required: true
                    }
                  ]}
                >
                  <Select
                    onChange={(e) => this.onChangeDistrict(e)}
                    showSearch
                    defaultValue={localStorage.getItem('district')}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    filterSort={(optionA, optionB) =>
                      optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                    }
                    allowClear
                  >
                    {this.state.ApiAmphure.filter(
                      (user) => user.province_id === this.state.ApiProvinceId
                    ).map((m) => (
                      <Option value={m.amphur_id}>{m.amphur_name}</Option>
                    ))}
                  </Select>
                </Form.Item>
                <br />
                <br />
                <Form.Item
                  name="subdistrict"
                  label="ตำบล"
                  rules={[
                    {
                      required: true
                    }
                  ]}
                  showSearch
                  defaultValue={localStorage.getItem('subdistrict')}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  filterSort={(optionA, optionB) =>
                    optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                  }
                  allowClear
                >
                  <Select
                    onChange={(e) => this.onChangeSubDistrict(e)}
                    showSearch
                    defaultValue={localStorage.getItem('subdistrict')}
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    filterSort={(optionA, optionB) =>
                      optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                    }
                    allowClear
                  >
                    {this.state.ApiTombon.filter(
                      (user) => user.amphur_id === this.state.ApiAmphureId
                    ).map((m) => (
                      <Option value={m.district_id}>{m.district_name}</Option>
                    ))}
                  </Select>
                </Form.Item>
                <br />
                <br />
                map
                <Textarea
                  defaultValue={this.state.map}
                  onChange={(e) => this.setState({ map: e.target.value })}
                />{' '}
                <br />
                <br />
                Status :
                <Select
                  defaultValue={localStorage.getItem('status')}
                  allowClear
                  onChange={(value) => this.setState({ status: value })}
                >
                  <Option value="Active">Active</Option>
                  <Option value="Offline">Offline</Option>
                  <Option value="Inactive">Inactive</Option>
                </Select>
                <br />
                <br />
                level :
                <Select
                  defaultValue={localStorage.getItem('level')}
                  allowClear
                  onChange={(value) => this.setState({ level: value })}
                >
                  <Option value="subdistrict">ระดับตำบล</Option>
                  <Option value="district">ระดับอำเภอ</Option>
                  <Option value="province">ระดับจังหวัด</Option>
                </Select>
                <br />
                <br />
                กรุณากดปุ่มเพื่อแก้ไขรูปภาพ
                <br />
                <a>(กรณีหากต้องการเพิ่มหรือแก้ไข ต้องเพิ่มพร้อมกันทั้ง 2 ภาพเท่านั้น)</a>
                <br />
                <br />
                <Button
                  type={this.state.disabledButton ? 'primary' : 'danger'}
                  onClick={(e) =>
                    this.state.disabledButton
                      ? this.setState({ disabledButton: false })
                      : this.setState({ disabledButton: true })
                  }
                >
                  {this.state.disabledButton
                    ? 'ยืนยันที่จะเปลี่ยนรูปภาพ'
                    : 'ยกเลิกการเปลี่ยนรูปภาพ'}
                </Button>
                <br />
                <br />
                {this.state.disabledButton ? null : (
                  <>
                    <a> เลือกรูปภาพหน้าสมุดบัญชีธนาคาร </a>
                    <input
                      // disabled={this.state.disabledButton}
                      type="file"
                      className="form-control"
                      name="upload_file"
                      //  defaultValue = {this.state.productImg}
                      onChange={this.handleInputChangeBookBank}
                    />
                  </>
                )}
                {this.state.filepreviewBookBank !== null ? (
                  <Image
                    className="previewimg"
                    src={this.state.filepreviewBookBank}
                    alt="UploadImage"
                  />
                ) : null}
              </Col>
            </Row>
          </Form>
          <br />
          <br />
          <Row justify="center">
            <Button
              type={this.state.disabledButton ? 'primary' : 'danger'}
              onClick={() => this.setState({ showModalSubmit: true })}
            >
              {this.state.disabledButton
                ? 'บันทึกข้อมูลโดยไม่เเก้ไขรูปภาพ'
                : 'บันทึกข้อมูลพร้อมเก้ไขรูปภาพ'}
            </Button>
            {/* <Button htmlType="button">Reset</Button> */}
          </Row>
        </div>
        <Modal
          title=""
          visible={this.state.showModalSubmit}
          onOk={this.submit}
          onCancel={() => this.setState({ showModalSubmit: false })}
        >
          ท่านยืนยันที่จะเเก้ไขข้อมูลทั้งหมดหรือไม่ ?
        </Modal>
      </>
    );
  }
}
EditMemberComponent.propTypes = {
  // placeholder: PropTypes.number.isRequired
  // Textarea:PropTypes.string.isRequired
};
