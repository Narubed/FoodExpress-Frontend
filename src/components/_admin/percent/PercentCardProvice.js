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

export default function PercentCardProvice({ images, Name }) {
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
            <CardHeader color="purple" contentPosition="none">
              <div className="w-full flex items-center justify-between">
                <h2 className="text-white text-2xl">ระดับจังหวัด </h2>
              </div>
            </CardHeader>
            <CardBody>
              <TextField
                color="info"
                fullWidth
                label="จังหวัด"
                {...getFieldProps('province_province')}
                error={Boolean(touched.province_province && errors.province_province)}
                helperText={touched.province_province && errors.province_province}
              />
              <br />
              <br />
              <TextField
                color="info"
                fullWidth
                label="NBA"
                {...getFieldProps('province_nba')}
                error={Boolean(touched.province_nba && errors.province_nba)}
                helperText={touched.province_nba && errors.province_nba}
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
