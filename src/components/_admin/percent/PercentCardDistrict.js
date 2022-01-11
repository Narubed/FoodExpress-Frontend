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
  const [district_district, setDistrict_district] = useState([]);
  const [district_province, setDistrict_province] = useState([]);
  const [district_nba, setDistrict_nba] = useState([]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    const getAllPrecent = await axios.get(`${process.env.REACT_APP_WEB_BACKEND}/getAllPrecent`);
    console.log(getAllPrecent.data.data);
    setDistrict_district(getAllPrecent.data.data[1].percent_district * 100);
    setDistrict_province(getAllPrecent.data.data[1].percent_provice * 100);
    setDistrict_nba(getAllPrecent.data.data[1].percent_nba * 100);
  }, []);

  const handleSubmits = (e) => {
    const data = {
      percent_id: 2,
      percent_name: 'district',
      percent_subdistrict: 0,
      percent_district: district_district / 100,
      percent_provice: district_province / 100,
      percent_nba: district_nba / 100
    };
    Swal.fire({
      title: 'Are you sure?',
      text: 'คุณต้องการเเก้ไขข้อมูลอำเภอหรือไม่ !',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, need it!',
      cancelButtonText: 'No, cancel!',
      reverseButtons: true
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.put(`${process.env.REACT_APP_WEB_BACKEND}/putPercent`, data);
        Swal.fire({
          position: '',
          icon: 'success',
          title: 'คุณได้ทำการเเก้ไขข้อมูลระดับอำเภอเเล้ว',
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
        Swal.fire('Cancelled', 'คุณได้ทำการยกเลิกการเเก้ไขเเล้ว :)', 'error');
      }
    });
  };

  return (
    <div>
      {' '}
      <Card>
        {' '}
        <CardHeader color="green" contentPosition="none">
          <div className="w-full flex items-center justify-between">
            <h2 className="text-white text-2xl">ระดับอำเภอ </h2>
          </div>
        </CardHeader>
        <CardBody>
          <br />
          <Input
            type="number"
            color="green"
            placeholder="อำเภอ"
            min="0"
            onChange={(e) => setDistrict_district(e.target.value)}
            defaultValue={district_district}
          />{' '}
          <br />
          <Input
            type="number"
            color="green"
            placeholder="จังหวัด"
            min="0"
            onChange={(e) => setDistrict_province(e.target.value)}
            defaultValue={district_province}
          />{' '}
          <br />
          <Input
            type="number"
            color="green"
            placeholder="NBA"
            min="0"
            onChange={(e) => setDistrict_nba(e.target.value)}
            defaultValue={district_nba}
          />
        </CardBody>
        <CardFooter>
          {' '}
          <div className="h-56 grid grid-cols-3 gap-4 content-between">
            <Button
              color="green"
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
