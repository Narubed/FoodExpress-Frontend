import React from 'react';
import axios from 'axios';
import { useFormik, Form, FormikProvider } from 'formik';
import { Box, Grid, Container, Typography, TextField } from '@mui/material';
import Card from '@material-tailwind/react/Card';
import CardHeader from '@material-tailwind/react/CardHeader';
import CardBody from '@material-tailwind/react/CardBody';
import Input from '@material-tailwind/react/Input';
import CardFooter from '@material-tailwind/react/CardFooter';
import Button from '@material-tailwind/react/Button';

export default function PercentCardDistrict({ images, Name }) {
  const formik = useFormik({
    // initialValues: {},
    // validationSchema: RegisterSchema,
    // onSubmit: (e) => handleSubmits(e)
  });
  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;
  return (
    <div>
      {' '}
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Card>
            {' '}
            <CardHeader color="cyan" contentPosition="none">
              <div className="w-full flex items-center justify-between">
                <h2 className="text-white text-2xl">ระดับอำเภอ </h2>
              </div>
            </CardHeader>
            <CardBody>
              <TextField
                color="primary"
                fullWidth
                label="อำเภอ"
                {...getFieldProps('district_district')}
                error={Boolean(touched.district_district && errors.district_district)}
                helperText={touched.district_district && errors.district_district}
              />
              <br />
              <br />
              <TextField
                color="primary"
                fullWidth
                label="จังหวัด"
                {...getFieldProps('district_province')}
                error={Boolean(touched.district_province && errors.district_province)}
                helperText={touched.district_province && errors.district_province}
              />
              <br />
              <br />
              <TextField
                color="primary"
                fullWidth
                label="NBA"
                {...getFieldProps('district_nba')}
                error={Boolean(touched.district_nba && errors.district_nba)}
                helperText={touched.district_nba && errors.district_nba}
              />
              <br />
              <br />
            </CardBody>
            <CardFooter>
              {' '}
              <div className="h-56 grid grid-cols-3 gap-4 content-between">
                <Button color="purple" buttonType="outline" ripple="dark">
                  ยืนยัน
                </Button>
              </div>
            </CardFooter>
          </Card>
        </Form>
      </FormikProvider>
    </div>
  );
}
