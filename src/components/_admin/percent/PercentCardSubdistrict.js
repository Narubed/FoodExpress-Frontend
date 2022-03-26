/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import Card from '@material-tailwind/react/Card';
import CardHeader from '@material-tailwind/react/CardHeader';
import CardBody from '@material-tailwind/react/CardBody';
import Input from '@material-tailwind/react/Input';
import CardFooter from '@material-tailwind/react/CardFooter';
import Button from '@material-tailwind/react/Button';
import Swal from 'sweetalert2';

export default function PercentCardSubdistrict() {
  const dispatch = useDispatch();
  const [subdistrict_subdistrict, setSubdistrict_subdistrict] = useState([]);
  const [subdistrict_district, setSubdistrict_district] = useState([]);
  const [subdistrict_province, setSubdistrict_province] = useState([]);
  const [subdistrict_nba, setSubdistrict_nba] = useState([]);
  dispatch({ type: 'OPEN' });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const getAllPrecent = await axios.get(`${process.env.REACT_APP_WEB_BACKEND}/getAllPrecent`);
    setSubdistrict_subdistrict(getAllPrecent.data.data[0].percent_subdistrict * 100);
    setSubdistrict_district(getAllPrecent.data.data[0].percent_district * 100);
    setSubdistrict_province(getAllPrecent.data.data[0].percent_provice * 100);
    setSubdistrict_nba(getAllPrecent.data.data[0].percent_nba * 100);
  }, []);
  dispatch({ type: 'TURNOFF' });
  const handleSubmits = () => {
    if (
      parseFloat(subdistrict_subdistrict) +
        parseFloat(subdistrict_district) +
        parseFloat(subdistrict_province) +
        parseFloat(subdistrict_nba) !==
      100
    ) {
      Swal.fire('กำหนดค่าไม่ถูกต้อง?', 'ค่าเปอร์เซ็นทั้งหมดรวมกันเเล้วไม่ถึง 100 %', 'question');
    } else {
      const dataSubdistric = {
        percent_id: 1,
        percent_name: 'subdistrict',
        percent_subdistrict: parseFloat(subdistrict_subdistrict) / 100,
        percent_district: parseFloat(subdistrict_district) / 100,
        percent_provice: parseFloat(subdistrict_province) / 100,
        percent_nba: parseFloat(subdistrict_nba) / 100
      };
      Swal.fire({
        text: 'คุณต้องการเเก้ไขข้อมูลตำบลนี้หรือไม่ !',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'ตกลง!',
        cancelButtonText: 'ยกเลิก!',
        reverseButtons: true
      }).then(async (result) => {
        if (result.isConfirmed) {
          dispatch({ type: 'OPEN' });
          await axios.put(`${process.env.REACT_APP_WEB_BACKEND}/putPercent`, dataSubdistric);
          dispatch({ type: 'TURNOFF' });
          Swal.fire({
            position: '',
            icon: 'success',
            title: 'คุณได้ทำการเเก้ไขข้อมูลระดับตำบลเเล้ว !',
            showConfirmButton: false,
            timer: 1500
          });

          // setTimeout(() => {
          //   window.location.reload(false);
          // }, 1500);
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          Swal.fire('ยกเลิก', 'คุณได้ทำการยกเลิกการเเก้ไขเเล้ว :)', 'error');
        }
      });
    }
  };

  return (
    <div>
      {' '}
      <Card>
        {' '}
        <CardHeader color="yellow" contentPosition="none">
          <div className="w-full flex items-center justify-between">
            <h2 className="text-white text-2xl">ระดับตำบล </h2>
          </div>
        </CardHeader>
        <CardBody>
          <br />
          <Input
            type="number"
            color="yellow"
            placeholder="ตำบล"
            min="0"
            max="100"
            onChange={(e) => setSubdistrict_subdistrict(e.target.value)}
            defaultValue={subdistrict_subdistrict}
          />{' '}
          <br />
          <Input
            type="number"
            color="yellow"
            placeholder="อำเภอ"
            min="0"
            onChange={(e) => setSubdistrict_district(e.target.value)}
            defaultValue={subdistrict_district}
          />{' '}
          <br />
          <Input
            type="number"
            color="yellow"
            placeholder="จังหวัด"
            min="0"
            onChange={(e) => setSubdistrict_province(e.target.value)}
            defaultValue={subdistrict_province}
          />{' '}
          <br />
          <Input
            type="number"
            color="yellow"
            placeholder="NBA"
            min="0"
            onChange={(e) => setSubdistrict_nba(e.target.value)}
            defaultValue={subdistrict_nba}
          />
        </CardBody>
        <CardFooter>
          <div className="h-56 grid grid-cols-3 gap-4 content-between">
            <Button
              disabled={sessionStorage.getItem('level') !== 'ManagerAdmin'}
              color="yellow"
              buttonType="outline"
              size="regular"
              rounded={false}
              block={false}
              iconOnly={false}
              ripple="dark"
              onClick={() => handleSubmits()}
            >
              ยืนยัน
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
