import React from 'react';
import classnames from 'classnames';
import Icon from 'mcore/icon';
import 'mcore/icon/style';
// import { Icon, BackToTop } from 'mcore/back-to-top';
import Header from '../Header';
import './style.scss';

const Container = ({ className, children, ...others }) => {
  const cls = classnames('app-container', className);

  return (
    <div className={cls} {...others}>
      <Header>{children}</Header>
      {/* <BackToTop>
        <div className="scroll-to-top">
          <Icon type="github" size="sm" />
        </div>
      </BackToTop> */}
    </div>
  );
};

export default Container;
