/* eslint-disable camelcase */
import { useEffect, useState } from 'react';
import { filter } from 'lodash';
import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';
// material
import { Stack, Button, Container, Typography, Badge } from '@mui/material';
import { styled } from '@mui/material/styles';

import CardBody from '@material-tailwind/react/CardBody';
import CardHeader from '@material-tailwind/react/CardHeader';
import Card from '@material-tailwind/react/Card';

import Page from '../../../../components/Page';
import Label from '../../../../components/Label';
import Scrollbar from '../../../../components/Scrollbar';
import SearchNotFound from '../../../../components/SearchNotFound';
// ----------------------------------------------------------------------
function AdminProductApp() {
  return (
    <>
      <Page title="Company | FoodExpress">
        <Container>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
              Company
            </Typography>
            <Button
              variant="contained"
              component={RouterLink}
              to="/admin/AdminRiderApp/AdminCreateRiderApp"
              startIcon={<Icon icon={plusFill} />}
            >
              New Company
            </Button>
          </Stack>
          <div className="min-h-screen bg-gray-100 text-gray-1000">
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
              <div className="mt-6">
                {/* <Table columns={columns} data={data} /> */}
                <Card>
                  <CardHeader color="orange" contentPosition="none">
                    <div className="w-full flex items-center justify-between">
                      <h2 className="text-white text-2xl">
                        {' '}
                        <Typography variant="h4" gutterBottom>
                          Company
                        </Typography>
                      </h2>
                    </div>
                  </CardHeader>
                </Card>
              </div>
            </main>
          </div>
        </Container>
      </Page>
    </>
  );
}
export default AdminProductApp;
