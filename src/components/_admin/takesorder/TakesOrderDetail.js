/* eslint-disable camelcase */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
// material
import { visuallyHidden } from '@mui/utils';
import {
  TableRow,
  TableCell,
  TableHead,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide
} from '@mui/material';
import { Icon } from '@iconify/react';

import Button from '@material-tailwind/react/Button';
// ----------------------------------------------------------------------
TakesOrderListHead.propTypes = {
  props: PropTypes.array,
  id_order_rider_id: PropTypes.string
};

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

export default function TakesOrderListHead({ props }) {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Button
              color="lightBlue"
              buttonType="link"
              size="regular"
              rounded
              block={false}
              iconOnly
              ripple="dark"
              onClick={() => setShowModal(true)}
            >
              <Icon icon="flat-color-icons:todo-list" width={30} height={30} />
            </Button>
          </TableCell>
        </TableRow>
      </TableHead>

      <Dialog
        fullWidth="fullWidth"
        maxWidth="lg"
        open={showModal}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setShowModal(false)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle> barcode:{props.id_order_rider_id}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <div className="flex flex-col">
              <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                  <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            ประเภทผู้ส่ง
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            ชื่อ
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            ที่อยู่ หรือ note
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            ประเภทผู้รับ
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            ชื่อ
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            ที่อยู่ หรือ note
                          </th>

                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {/* คลิ๊ก */}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {[props].map((data) => (
                          <tr key={data.id_order_rider_id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {data.order_rider_dealer_type}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {data.order_rider_dealer_name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {data.order_rider_dealer_note}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">
                                {data.order_rider_consignee_type}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {data.order_rider_consignee_name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {data.order_rider_consignee_note}
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" />
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            color="red"
            buttonType="link"
            onClick={() => setShowModal(false)}
            ripple="dark"
            danger
          >
            ยกเลิก
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
