import React from 'react';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import axios from 'axios';
import { useFormik, Form, FormikProvider } from 'formik';
import { Box, Grid, Container, Typography, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Card from '@material-tailwind/react/Card';
import CardHeader from '@material-tailwind/react/CardHeader';
import CardBody from '@material-tailwind/react/CardBody';
import Input from '@material-tailwind/react/Input';
import CardFooter from '@material-tailwind/react/CardFooter';
import Button from '@material-tailwind/react/Button';

PercentCardSubdistrict.propTypes = {
  Percent: PropTypes.array
};
export default function PercentCardSubdistrict({ Percent }) {
  const RegisterSchema = Yup.object().shape({
    subdistrict_subdistrict: Yup.number().required('subdistrict_subdistrict tel is required'),
    subdistrict_district: Yup.number().required('subdistrict_district tel is required'),
    subdistrict_province: Yup.number().required('subdistrict_province tel is required'),
    subdistrict_nba: Yup.number().required('subdistrict_nba tel is required')
  });
  const handleSubmits = (e) => {
    console.log(e);
  };
  const formik = useFormik({
    initialValues: {
      subdistrict_id: '',
      subdistrict_subdistrict: '',
      subdistrict_district: '',
      subdistrict_province: '',
      subdistrict_nba: ''
      // subdistrict: Percent.percent_id,
      // subdistrict_subdistrict: Percent.percent_subdistrict,
      // subdistrict_district: Percent.percent_district,
      // subdistrict_province: Percent.percent_provice,
      // subdistrict_nba: Percent.percent_nba
    },
    validationSchema: RegisterSchema,
    onSubmit: (e) => handleSubmits(e)
  });
  const { errors, touched, handleSubmit, isSubmitting, getFieldProps } = formik;
  return (
    <div>
      {' '}
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Card>
            {' '}
            <CardHeader color="yellow" contentPosition="none">
              <div className="w-full flex items-center justify-between">
                <h2 className="text-white text-2xl">ระดับตำบล </h2>
              </div>
            </CardHeader>
            <CardBody>
              <TextField
                color="warning"
                fullWidth
                label="ตำบล"
                {...getFieldProps('subdistrict_subdistrict')}
                error={Boolean(touched.subdistrict_subdistrict && errors.subdistrict_subdistrict)}
                helperText={touched.subdistrict_subdistrict && errors.subdistrict_subdistrict}
              />
              <br />
              <br />
              <TextField
                color="warning"
                fullWidth
                label="อำเภอ"
                {...getFieldProps('subdistrict_district')}
                error={Boolean(touched.subdistrict_district && errors.subdistrict_district)}
                helperText={touched.subdistrict_district && errors.subdistrict_district}
              />
              <br />
              <br />
              <TextField
                color="warning"
                fullWidth
                label="จังหวัด"
                {...getFieldProps('subdistrict_province')}
                error={Boolean(touched.subdistrict_province && errors.subdistrict_province)}
                helperText={touched.subdistrict_province && errors.subdistrict_province}
              />
              <br />
              <br />
              <TextField
                color="warning"
                fullWidth
                label="NBA"
                {...getFieldProps('subdistrict_nba')}
                error={Boolean(touched.subdistrict_nba && errors.subdistrict_nba)}
                helperText={touched.subdistrict_nba && errors.subdistrict_nba}
              />
              <br />
              <br />
            </CardBody>
            <CardFooter>
              {' '}
              <div className="h-56 grid grid-cols-3 gap-4 content-between">
                <LoadingButton
                  fullWidth
                  size="large"
                  type="submit"
                  variant="contained"
                  color="warning"
                  loading={isSubmitting}
                >
                  ยืนยัน
                </LoadingButton>
              </div>
            </CardFooter>
          </Card>
        </Form>
      </FormikProvider>
    </div>
  );
}
