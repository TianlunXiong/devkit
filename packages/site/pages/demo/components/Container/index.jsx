import React, { useEffect, useState } from 'react';
import classnames from 'classnames';
import Icon from 'mcore/icon';
import Radio from 'mcore/radio';
import Popper from 'mcore/popper';
import { darken } from '@/utils/color';
import Context from '@/utils/context';
import Events from '@/utils/events';
import './style.scss';

const Icons = Icon.createFromIconfont('//at.alicdn.com/t/font_1340918_lpsswvb7yv.js');

const Container = (props) => {
  const [lang, setLang] = useState(window.sessionStorage.language || 'zhCN');
  const [primary, setPrimary] = useState(window.sessionStorage.primary || '#3c6ff0');

  const setCssVar = (color) => {
    document.documentElement.style.setProperty('--theme-primary', color);
    document.documentElement.style.setProperty('--theme-primary-dark', darken(color, 0.04));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    setCssVar(primary);

    Events.on(window, 'message', ({ data }) => {
      if (data.lang) {
        setLang(data.lang);
      }
    });
  }, [primary]);

  const { className, children } = props;
  const cls = classnames('app-container', className);

  return (
    <div className={cls}>
      <nav>
        <Popper
          trigger="click"
          content={
            <ul className="color-pick-list">
              {[
                '#3c6ff0',
                '#F1303D',
                '#00bc70',
                '#1890ff',
                '#fa541b',
                '#13c2c2',
                '#712fd1',
              ].map((color, index) => {
                return (
                  <li
                    key={+index}
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      setPrimary(color);
                      setCssVar(color);
                      window.sessionStorage.primary = color;
                    }}
                  />
                );
              })}
            </ul>
          }
        >
          <span className="color-pick" style={{ backgroundColor: primary }} />
        </Popper>
        {window.frames.length === window.parent.frames.length && (
          <>
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
          </>
        )}
      </nav>
      <Context.Provider value={{ lang, primary }}>{children}</Context.Provider>
    </div>
  );
};

export default Container;
