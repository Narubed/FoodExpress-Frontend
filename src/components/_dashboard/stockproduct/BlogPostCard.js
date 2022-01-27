/* eslint-disable global-require */
/* eslint-disable camelcase */
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import { Link as RouterLink } from 'react-router-dom';
import shareFill from '@iconify/icons-eva/share-fill';
import messageCircleFill from '@iconify/icons-eva/message-circle-fill';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
// material
import { alpha, styled } from '@mui/material/styles';
import { Box, Link, Card, Grid, Avatar, Typography, CardContent } from '@mui/material';
import Label from '@material-tailwind/react/Label';
// utils
import { fDate } from '../../../utils/formatTime';
import { fNumber } from '../../../utils/formatNumber';
//
import SvgIconStyle from '../../SvgIconStyle';

// ----------------------------------------------------------------------

const CardMediaStyle = styled('div')({
  position: 'relative',
  paddingTop: 'calc(100% * 3 / 4)'
});

const TitleStyle = styled(Link)({
  height: 44,
  overflow: 'hidden',
  WebkitLineClamp: 2,
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical'
});

const AvatarStyle = styled(Avatar)(({ theme }) => ({
  zIndex: 9,
  width: 32,
  height: 32,
  position: 'absolute',
  left: theme.spacing(3),
  bottom: theme.spacing(-2)
}));

const CoverImgStyle = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute'
});

// ----------------------------------------------------------------------

BlogPostCard.propTypes = {
  stock: PropTypes.object.isRequired
};

export default function BlogPostCard({ stock }) {
  const { stock_product_name, productImg, currency, stock_product_amount } = stock;

  return (
    <Grid item xs={12} sm={6} md={3}>
      <Card sx={{ position: 'relative' }}>
        <CardMediaStyle sx={{}}>
          <SvgIconStyle
            color="paper"
            src="/static/icons/shape-avatar.svg"
            sx={{
              width: 80,
              height: 36,
              zIndex: 9,
              bottom: -15,
              position: 'absolute'
            }}
          />

          <AvatarStyle
            alt={stock_product_name}
            // eslint-disable-next-line import/no-dynamic-require
            src={require(`../../../assets/img/${productImg}`).default}
          />

          <CoverImgStyle
            alt={stock_product_name}
            src={
              // eslint-disable-next-line import/no-dynamic-require
              require(`../../../assets/img/${productImg}`).default
            }
          />
        </CardMediaStyle>

        <CardContent
          sx={{
            pt: 4
          }}
        >
          <Typography
            gutterBottom
            variant="caption"
            sx={{ color: 'text.disabled', display: 'block' }}
          >
            {stock_product_name}
          </Typography>

          <TitleStyle
            to="#"
            color="inherit"
            variant="subtitle2"
            underline="hover"
            component={RouterLink}
          >
            เหลือ {fNumber(stock_product_amount)} {currency}
          </TitleStyle>
        </CardContent>
      </Card>
    </Grid>
  );
}