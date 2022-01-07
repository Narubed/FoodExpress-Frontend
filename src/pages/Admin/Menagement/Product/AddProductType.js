/* eslint-disable prettier/prettier */
import React, { Component } from 'react';
import Modal from '@material-tailwind/react/Modal';
import ModalHeader from '@material-tailwind/react/ModalHeader';
import ModalBody from '@material-tailwind/react/ModalBody';
import ModalFooter from '@material-tailwind/react/ModalFooter';
import Button from '@material-tailwind/react/Button';
import Input from '@material-tailwind/react/Input';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { Row, Col } from 'antd';
import { FolderAddOutlined, AppstoreAddOutlined, UserDeleteOutlined } from '@ant-design/icons';

export default class AddProductType extends Component {
  constructor(props) {
    super(props);
    this.state = {
      setShowModalCode: false,
      setShowModalCodeEdit: false,
      setShowModalCodeDelete: false,
      setShowModalCodeDelete2: false,
      // eslint-disable-next-line react/no-unused-state
      dataTypes: [],
      inputNewType: null,
      typeIdEdit: null,
      typeName: null,
      inputEditType: null,
      inputDeleteType: null,
      offset: 0,
      // eslint-disable-next-line react/no-unused-state
      data: [],
      perPage: 100,
      // eslint-disable-next-line react/no-unused-state
      currentPage: 0
    };
    this.handlePageClick = this.handlePageClick.bind(this);
  }

  receivedData = async () => {
    await axios.get('http://localhost:8000/producttypes').then((res) => {
      const { data } = res.data;
      const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage);
      // eslint-disable-next-line react/no-unused-state
      this.setState({ dataTypes: res.data.data });
      const postData = slice.map((d) => (
        <>
          <ModalBody>
            <p className="text-base leading-relaxed text-gray-600 font-normal">
              <br />
              <>
                <ul key={d.id}>ชื่อประเภทสินค้า :{d.nameproducttype}</ul>
              </>
            </p>
          </ModalBody>
          <ModalFooter>
            <Button
              color="cyan"
              onClick={(e) =>
                this.setState({
                  setShowModalCode: false,
                  setShowModalCodeEdit: true,
                  typeIdEdit: d.id,
                  typeName: d.nameproducttype
                })
              }
              ripple="dark"
            >
              เเก้ไขชื่อสินค้านี้
            </Button>
            <Button
              inputDeleteType
              color="red"
              onClick={(e) =>
                this.setState({
                  setShowModalCode: false,
                  setShowModalCodeDelete: true,
                  inputDeleteType: d.id
                })
              }
              // onClick={this.deleteProductType}
              ripple="dark"
            >
              ลบประเภทสินค้านี้
            </Button>
          </ModalFooter>
        </>
      ));
      this.setState({
        // eslint-disable-next-line react/no-access-state-in-setstate
        pageCount: Math.ceil(data.length / this.state.perPage),

        postData
      });
    });
  };

  deleteProductType = async () => {
    // console.log(this.state.inputDeleteType)
    const data = this.state.inputDeleteType;
    const reqProduct = await axios.get('http://localhost:8000/products');
    // console.log(reqProduct.data.data)
    const newF = reqProduct.data.data.filter((fil) => fil.typeid === data);
    if (newF.length !== 0) {
      console.log('newFil=>', newF.length);
      this.setState({
        setShowModalCodeDelete2: true,
        setShowModalCodeDelete: false
      });
    } else {
      const data = this.state.inputDeleteType;
      await axios
        .delete(`http://localhost:8000/producttype/${data}`)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
      this.setState({ setShowModalCodeDelete: false });
      window.location.reload(false);
    }
  };

  handlePageClick = (e) => {
    const selectedPage = e.selected;
    // eslint-disable-next-line react/no-access-state-in-setstate
    const offset = selectedPage * this.state.perPage;

    this.setState(
      {
        // eslint-disable-next-line react/no-unused-state
        currentPage: selectedPage,
        offset
      },
      () => {
        this.receivedData();
      }
    );
  };

  componentDidMount = async () => {
    this.receivedData();
  };

  postProductType = async () => {
    const data = { name: this.state.inputNewType };
    console.log(data);
    await axios
      .post('http://localhost:8000/producttype/', data)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
    window.location.reload(false);
  };

  editProductType = async () => {
    const data = {
      id: this.state.typeIdEdit,
      nameproducttype: this.state.inputEditType
    };
    await axios
      .put('http://localhost:8000/producttype/', data)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
    window.location.reload(false);
  };

  render() {
    // const defaultTypename = this.state.typeName
    return (
      <>
        <Button
          color="lightBlue"
          buttonType="link"
          size="regular"
          rounded={false}
          block={false}
          iconOnly={false}
          ripple="dark"
          onClick={(e) => this.setState({ setShowModalCode: true })}
        >
          <AppstoreAddOutlined
            style={{ fontSize: '250%', color: '#08c' }}
            twoToneColor="#eb2f96"
            size=""
          />
          เพิ่ม-ลบ-แก้ไขประเภทสินค้า
        </Button>

        <br />

        <Modal
          size="sm"
          active={this.state.setShowModalCode}
          toggler={() => this.setState({ setShowModalCode: false })}
        >
          <ModalHeader toggler={() => this.setState({ setShowModalCode: false })}>
            เพิ่ม และ ลบ ประเภทของสินค้า
          </ModalHeader>

          <Input
            type="text"
            color="lightBlue"
            size="regular"
            outline={false}
            placeholder=" กรุณาเพิ่มสถานะของสินค้าใหม่"
            onChange={(e) => this.setState({ inputNewType: e.target.value })}
          />

          {this.state.postData}

          <ReactPaginate
            previousLabel="ย้อนกลับ"
            nextLabel="ถัดไป"
            breakLabel="..."
            breakClassName="break-me"
            pageCount={this.state.pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={this.handlePageClick}
            containerClassName="pagination"
            subContainerClassName="pages pagination"
            activeClassName="active"
          />
          <ModalFooter>
            <Button
              color="red"
              buttonType="link"
              onClick={(e) => this.setState({ setShowModalCode: false })}
              ripple="dark"
            >
              ยกเลิก
            </Button>

            <Button
              //   href="/admin"
              color="green"
              // onClick={(e) => this.setState({ setShowModalCode: false })}
              // eslint-disable-next-line no-sequences
              onClick={this.postProductType}
              //   onClick={this.submit}
              ripple="light"
            >
              ยืนยัน
            </Button>
          </ModalFooter>
        </Modal>
        {/* EDIT---------------------------------------------- */}
        <Modal
          size="xl"
          active={this.state.setShowModalCodeEdit}
          toggler={() => this.setState({ setShowModalCodeEdit: false })}
        >
          <ModalHeader toggler={() => this.setState({ setShowModalCodeEdit: false })}>
            แก้ไขประเภทสินค้า
          </ModalHeader>
          <ModalBody>
            <Input
              type="text"
              color="lightBlue"
              size="regular"
              outline={false}
              // warning placeholder
              placeholder={this.state.typeName}
              onChange={(e) => this.setState({ inputEditType: e.target.value })}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              color="red"
              buttonType="link"
              onClick={(e) => this.setState({ setShowModalCodeEdit: false })}
              ripple="dark"
            >
              ยกเลิก
            </Button>
            <Button
              //   href="/admin"
              color="green"
              // onClick={(e) => this.setState({ setShowModalCode: false })}
              // eslint-disable-next-line no-sequences
              onClick={this.editProductType}
              //   onClick={this.submit}
              ripple="light"
            >
              ยืนยัน
            </Button>
          </ModalFooter>
        </Modal>
        {/* DELETE-------------------------------------------------------- */}
        <Modal
          size="sm"
          active={this.state.setShowModalCodeDelete}
          toggler={() => this.setState({ setShowModalCodeDelete: false })}
        >
          <ModalHeader toggler={() => this.setState({ setShowModalCodeDelete: false })}>
            ยืนยันที่จะลบประเภทสินค้านี้หรือไม่
          </ModalHeader>
          <ModalBody>
            กรุณาตรวจสอบว่ายังมีสินค้าอยู่ที่อยู่ประเภทนี้ว่ามีอยู่หรือไม่
            หากมีจะไม่สามารถทำการลบประเภทสินค้านี้ได้
            <br />
          </ModalBody>
          <ModalFooter>
            <Button
              color="red"
              buttonType="link"
              onClick={(e) => this.setState({ setShowModalCodeDelete: false })}
              ripple="dark"
            >
              ยกเลิก
            </Button>
            <Button
              //   href="/admin"
              color="green"
              // onClick={(e) => this.setState({ setShowModalCode: false })}
              // eslint-disable-next-line no-sequences
              onClick={this.deleteProductType}
              //   onClick={this.submit}
              ripple="light"
            >
              ยืนยัน
            </Button>
          </ModalFooter>
        </Modal>
        {/* DELETE2-------------------------------------------------------- */}
        <Modal
          size="sm"
          active={this.state.setShowModalCodeDelete2}
          toggler={() => this.setState({ setShowModalCodeDelete2: false })}
        >
          <ModalHeader toggler={() => this.setState({ setShowModalCodeDelete2: false })}>
            ไม่สามารถลบได้
          </ModalHeader>
          <ModalBody>
            เนื่องจากยังมีสินค้าที่อยู่ในประเภทสินค้านี้อยู่กรุณาตรวจสอบใหม่อีกครั้ง
            <br />
          </ModalBody>
          <ModalFooter>
            <Button
              //   href="/admin"
              color="green"
              onClick={(e) => this.setState({ setShowModalCodeDelete2: false })}
              // eslint-disable-next-line no-sequences
              // onClick={this.deleteProductType}
              //   onClick={this.submit}
              ripple="light"
            >
              ยืนยัน
            </Button>
          </ModalFooter>
        </Modal>
      </>
    );
  }
}
