import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { IntlProvider, FormattedMessage } from 'react-intl';
import Icon from 'mcore/icon';
import Popup from 'mcore/popup';
import Radio from 'mcore/radio';
// import { Dropdown, Menu } from 'mcore-web';
import classnames from 'classnames';
import 'mcore/icon/style'
import 'mcore/popup/style'
import 'mcore/radio/style'
// import docsearch from 'docsearch.js';
// import MenuComponent from '@site/web/components/Menu';
import Events from '../../../../utils/events';
import Context from '../../../../utils/context';
import Locale from '../../locale';
import { version } from '@/package.json';
// import 'docsearch.js/dist/cdn/docsearch.min.css';

import LOGO from '@/assets/images/logo.svg'
import './style.scss';

// const initDocSearch = () => {
//   docsearch({
//     apiKey: '44e980b50447a3a5fac9dc2a4808c439',
//     indexName: 'mcore',
//     inputSelector: '.search input',
//     debug: false,
//   });
// };

const Header = ({ children }) => {
  const searchInput = useRef();
  const location = useLocation();
  const [menu, toggleMenu] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [lang, setLang] = useState(window.sessionStorage.language || 'zhCN');
  const currentPageKey = location.pathname.split('/')[1] || '/';

  const keyupEvent = (event) => {
    if (event.keyCode === 83 && event.target === document.body) {
      searchInput.current.focus();
    }
  };

  const activeClassName = (keys) => {
    return classnames({
      active: keys.indexOf(currentPageKey) > -1,
    });
  };

  const NAV_ITEMS = [
    { key: 'components', link: '#/components/quick-start', title: <FormattedMessage id="app.home.nav.components" /> },
  ];

  // useEffect(() => {
  //   Events.on(document, 'keyup', keyupEvent);
  //   initDocSearch();

  //   return () => {
  //     Events.off(document, 'keyup', keyupEvent);
  //   };
  // }, []);

  return (
    <IntlProvider locale="zh-CN" messages={Locale[lang]}>
      <Context.Provider value={{ lang }}>
        <header>
          <div className="header-container">
            <div className="logo">
              <a href="#/">
                <img alt="logo" src={LOGO} />
                vikit-ui
                <sup className="logo-version">v{version}</sup>
              </a>
            </div>
            <nav>
              <div className="search">
                <Icon type="search" />
                <FormattedMessage id="app.home.nav.search">
                  {(txt) => (
                    <input placeholder={txt} ref={searchInput} />
                  )}
                </FormattedMessage>
              </div>
              <ul>
                {NAV_ITEMS.map((item) => <li key={item.key}><a href={item.link} className={activeClassName([item.key])}>{item.title}</a></li>)}
              </ul>
              <div className="lang">
                <Radio.Group
                  compact
                  type="button"
                  value={lang}
                  onChange={(value) => {
                    setLang(value);
                    window.sessionStorage.language = value;
                  }}
                >
                  <Radio value="zhCN">中文</Radio>
                  <Radio value="enUS">EN</Radio>
                </Radio.Group>
              </div>
            </nav>
          </div>
        </header>
        {children}
      </Context.Provider>
    </IntlProvider>
  );
};

export default Header;
