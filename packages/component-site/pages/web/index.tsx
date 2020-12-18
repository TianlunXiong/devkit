import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { IntlProvider, FormattedMessage } from 'react-intl';
import Locale from './locale';
import './style.scss';


const Test = () => 'ok112'

const App = () => {
  return (
    <IntlProvider locale="zh-CN" messages={Locale['zhCN']}>
      <FormattedMessage id="app.home.nav.search">
        {(txt) => <input placeholder={`${txt}`} />}
      </FormattedMessage>
      {/* <Switch> */}
        {/* <Route exact path="/" component={Test} /> */}
        {/* <Route path="/components/:component" component={require('@site/web/pages/Components').default} /> */}
        {/* <Route path="/design/:page" component={require('@site/web/pages/Design').default} /> */}
        {/* <Route path="*" component={require('@site/web/pages/NotFoundPage').default} /> */}
      {/* </Switch> */}
    </IntlProvider>
  );
};

export default App;
