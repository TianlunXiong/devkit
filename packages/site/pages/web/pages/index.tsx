import React, { useEffect, useState, useRef } from 'react';
import { useHistory, Switch, Route } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import Container from '../components/Container';
import './index.scss'
// import { Dropdown } from 'zarm-web';
// import QRious from 'qrious';
// import Meta from '@site/web/components/Meta';

const IndexPage = () => {
  const qrcode = useRef();
  const [dropdown, setDropdown] = useState(false);
  const [mounted, setMounted] = useState(false);
  const history = useHistory();
  const demoURL = `${window.location.origin}/demo.html`;

  useEffect(() => {
    if (!dropdown || mounted) return;

    // const qr = new QRious({
    //   element: qrcode.current,
    //   value: demoURL,
    //   size: 132,
    // });
    setMounted(true);
  }, [demoURL, dropdown, mounted]);

  return (
    <Container className="index-page">
      {/* <FormattedMessage id="app.title">
        {(txt) => (
          <Meta title={`Zarm Design - ${txt}`} />
        )}
      </FormattedMessage> */}
      <main>
        <div className="banner">
          {/* <img src={require('./images/banner@2x.png')} alt="" /> */}
        </div>
        <div className="introduce">
          <div className="title">
            <span>M5</span>
          </div>
          <div className="description">移动端组件库</div>
          <div className="description">
            <FormattedMessage id="app.home.index.introduce" />
          </div>
          <div className="navigation">
            <button
              type="button"
              onClick={() => history.push('/components/quick-start')}
            >
              <FormattedMessage id="app.home.index.getting-started" />
            </button>
          </div>
        </div>
      </main>
    </Container>
  );
};

export default IndexPage;
