import React, { useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { IntlProvider, FormattedMessage } from 'react-intl';
import Panel from 'mcore/panel';
import Cell from 'mcore/cell';
import DOCUMENT from '../../../web/docs';
import { pascalCase } from 'change-case';
import Container from '../../components/Container';
// import Footer from '@site/demo/components/Footer';
import Context from '@/utils/context';
import Events from '@/utils/events';
import Locale from '@/pages/web/locale';
import './style.scss';

const { components } = DOCUMENT;

const Child = () => {
  const history = useHistory();
  const { lang } = useContext(Context);

  const getMenus = (key) => {
    const list = components[key] || [];

    return (
      <Panel title={(
        <>
          <FormattedMessage id={`app.components.type.${key}`} />
          （{list.length}）
        </>
      )}
      >
        {
          list
            .sort((a, b) => {
              return a.key.localeCompare(b.key);
            })
            .map((component, i) => (
              <Cell
                hasArrow
                key={+i}
                title={(
                  <div className="menu-item-content">
                    <span>{pascalCase(component.key)}</span>
                    {lang !== 'enUS' && <span className="chinese">{component.name}</span>}
                  </div>
                )}
                onClick={() => history.push(`/${component.key}`)}
              />
            ))
        }
      </Panel>
    );
  };

  return (
    <IntlProvider locale="zh-CN" messages={Locale[lang]}>
      <header>
        <section className="brand">
          <div className="brand-title">
            <span>vikit-ui</span>
          </div>
          <div className="brand-description">
            <FormattedMessage id="app.home.index.introduce" />
          </div>
        </section>
      </header>
      <main>
        {getMenus('general')}
        {getMenus('form')}
        {getMenus('feedback')}
        {getMenus('view')}
        {getMenus('navigation')}
        {getMenus('other')}
      </main>
      {/* <Footer /> */}
    </IntlProvider>
  );
};

const Page = () => {
  const setPageScroll = () => {
    window.sessionStorage.indexPageScroll = window.scrollY;
  };

  const loadPageScroll = () => {
    const scrollY = window.sessionStorage.indexPageScroll;
    if (!scrollY) return;
    window.scrollTo(0, scrollY);
  };

  useEffect(() => {
    loadPageScroll();
    Events.on(window, 'scroll', setPageScroll);

    return () => {
      Events.off(window, 'scroll', setPageScroll);
    };
  }, []);

  return (
    <Container className="index-page">
      <Child />
    </Container>
  );
};

export default Page;
