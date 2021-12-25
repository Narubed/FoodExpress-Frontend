// routes
import React, { Component } from 'react';
import Router from './routes';
import RouterAdmin from './routers_admin';
// theme
import ThemeConfig from './theme';
import GlobalStyles from './theme/globalStyles';
// components
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/charts/BaseOptionChart';
import RouterNoAccessToken from './routes_no_accessToken';
// ----------------------------------------------------------------------
// eslint-disable-next-line react/prefer-stateless-function
class App extends Component {
  render() {
    const token = sessionStorage.getItem('accessToken');
    const role = sessionStorage.getItem('role');
    console.log(role);
    if (!token || token !== 'NBA') {
      return (
        <ThemeConfig>
          <ScrollToTop />
          <GlobalStyles />
          <BaseOptionChartStyle />
          <RouterNoAccessToken />
        </ThemeConfig>
      );
    }
    if (role === 'Admin') {
      return (
        <>
          <ThemeConfig>
            <ScrollToTop />
            <GlobalStyles />
            <BaseOptionChartStyle />
            <RouterAdmin />
          </ThemeConfig>
        </>
      );
    }
    return (
      <>
        <ThemeConfig>
          <ScrollToTop />
          <GlobalStyles />
          <BaseOptionChartStyle />
          <Router />
        </ThemeConfig>
      </>
    );
  }
}

export default App;
