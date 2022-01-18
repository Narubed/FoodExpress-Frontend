/* eslint-disable camelcase */
import { useState } from 'react';
import PropTypes from 'prop-types';
// material
import { visuallyHidden } from '@mui/utils';
import { Box, Checkbox, TableRow, TableCell, TableHead, TableSortLabel } from '@mui/material';
import { Icon } from '@iconify/react';
import Modal from '@material-tailwind/react/Modal';
import ModalHeader from '@material-tailwind/react/ModalHeader';
import ModalBody from '@material-tailwind/react/ModalBody';
import ModalFooter from '@material-tailwind/react/ModalFooter';
import Button from '@material-tailwind/react/Button';
// ----------------------------------------------------------------------

TakesOrderListHead.propTypes = {
  props: PropTypes.array,
  id_order_rider_id: PropTypes.string
};

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
      <Modal size="lg" active={showModal} toggler={() => setShowModal(false)}>
        <div>
          <ModalHeader toggler={() => setShowModal(false)}>
            barcode:{props.id_order_rider_id}
          </ModalHeader>
        </div>
        <ModalBody>
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
                          ชื่อบริษัท
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          ที่อยู่บริษัท
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          ชื่อผู้รับสินค้า
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          ที่อยู่ที่ต้องจัดส่ง
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
                        <tr key={data.order_rider_product_name}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {data.order_rider_company_name}
                            </div>
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap">
                            {data.order_rider_company_company_address}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">{data.firstname}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{data.address}</td>

                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" />
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="red"
            buttonType="link"
            onClick={(e) => setShowModal(false)}
            ripple="dark"
            danger
          >
            ยกเลิก
          </Button>
          {/* <Button onClick={handlePrint}> oss</Button> */}
          {/* <Button
            color="lightBlue"
            buttonType="link"
            size="regular"
            rounded
            block={false}
            iconOnly
            ripple="dark"
          >
            <Icon icon="flat-color-icons:print" width={32} height={32} />
          </Button> */}
        </ModalFooter>
      </Modal>
    </>
  );
}
