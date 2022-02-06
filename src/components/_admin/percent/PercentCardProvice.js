/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from '@material-tailwind/react/Card';
import CardHeader from '@material-tailwind/react/CardHeader';
import CardBody from '@material-tailwind/react/CardBody';
import Input from '@material-tailwind/react/Input';
import CardFooter from '@material-tailwind/react/CardFooter';
import Button from '@material-tailwind/react/Button';
import Swal from 'sweetalert2';

export default function PercentCardProvice() {
  const [province_province, setProvince_province] = useState([]);
  const [province_nba, setProvince_nba] = useState([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const getAllPrecent = await axios.get(`${process.env.REACT_APP_WEB_BACKEND}/getAllPrecent`);
    setProvince_province(getAllPrecent.data.data[2].percent_provice * 100);
    setProvince_nba(getAllPrecent.data.data[2].percent_nba * 100);
  }, []);

  const handleSubmits = (e) => {
    if (parseFloat(province_province) + parseFloat(province_nba) !== 100) {
      Swal.fire('กำหนดค่าไม่ถูกต้อง?', 'ค่าเปอร์เซ็นทั้งหมดรวมกันเเล้วไม่ถึง 100 %', 'question');
    } else {
      const data = {
        percent_id: 3,
        percent_name: 'province',
        percent_subdistrict: 0,
        percent_district: 0,
        percent_provice: parseFloat(province_province) / 100,
        percent_nba: parseFloat(province_nba) / 100
      };
      Swal.fire({
        text: 'คุณต้องการเเก้ไขข้อมูลจังหวัดหรือไม่ !',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'ตกลง!',
        cancelButtonText: 'ยกเลิก!',
        reverseButtons: true
      }).then(async (result) => {
        if (result.isConfirmed) {
          await axios.put(`${process.env.REACT_APP_WEB_BACKEND}/putPercent`, data);
          Swal.fire({
            position: '',
            icon: 'success',
            title: 'คุณได้ทำการเเก้ไขข้อมูลระดับจังหวัดเเล้ว !',
            showConfirmButton: false,
            timer: 1500
          });
          setTimeout(() => {
            window.location.reload(false);
          }, 1500);
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
        <CardHeader color="purple" contentPosition="none">
          <div className="w-full flex items-center justify-between">
            <h2 className="text-white text-2xl">ระดับจังหวัด </h2>
          </div>
        </CardHeader>
        <CardBody>
          <br />
          <Input
            type="number"
            color="purple"
            placeholder="จังหวัด"
            min="0"
            onChange={(e) => setProvince_province(e.target.value)}
            defaultValue={province_province}
          />{' '}
          <br />
          <Input
            type="number"
            color="purple"
            placeholder="NBA"
            min="0"
            onChange={(e) => setProvince_nba(e.target.value)}
            defaultValue={province_nba}
          />
        </CardBody>
        <CardFooter>
          {' '}
          <div className="h-56 grid grid-cols-3 gap-4 content-between">
            <Button
              color="purple"
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
