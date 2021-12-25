// routes
import React, { Component } from 'react';
import Router from './routes';
// theme
import ThemeConfig from './theme';
import GlobalStyles from './theme/globalStyles';
// components
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/charts/BaseOptionChart';
// ----------------------------------------------------------------------
// eslint-disable-next-line react/prefer-stateless-function
class App extends Component {
  render() {
    const a = 6;
    if (a === 5) {
      console.log(a);
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
