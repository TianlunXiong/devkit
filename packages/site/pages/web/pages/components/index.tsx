import React, { useState, useContext, useRef, useEffect } from 'react';
import { Route, Switch, Redirect, useParams } from 'react-router-dom';
import classnames from 'classnames';
import { FormattedMessage } from 'react-intl';
import Icon from 'mcore/icon';
import 'mcore/icon/style';
// import { documents, components } from '@site/site.config';
import LoadComponent from '@loadable/component';
import Context from '../../../../utils/context';
import Container from '../../components/Container';
// import SideBar from '@site/web/components/SideBar';
// import Footer from '@site/web/components/Footer';
import Markdown from '../../components/Markdown';

import btndoc from '../../docs/components/button.md'
import './style.scss';

const Button = LoadComponent(() => {
  import('mcore/button/style')
  return import('mcore/button').then(({ default: Button }) => {
    function Wrapper() {
      return <Button>Hi</Button>
    }
    return Wrapper
  })
});


const Doc = (
  <Markdown document={btndoc} component={{ name: '按钮', key: '01' }} />
);



const isComponentPage = (page) => ['introduce', 'quick-start', 'change-log'].indexOf(page) === -1;

// const LoadableComponent = (component) => {
//   return Loadable({
//     loader: component.module,
//     render: (loaded, props) => {
//       return <Markdown document={loaded.default} component={component} {...props} />;
//     },
//     loading: () => null,
//   });
// };

const Icons = Icon.createFromIconfont('//at.alicdn.com/t/font_1340918_lpsswvb7yv.js');

const Simulator = () => {
  const params = useParams();
  const simulatorRef = useRef();
  const { lang } = useContext(Context);
  const [affix, setAffix] = useState(false);

  const simulatorCls = classnames('simulator', {
    'simulator--affix': affix,
  });

  useEffect(() => {
    !(/(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent)) && simulatorRef.current.contentWindow.postMessage({ lang });
  }, [lang]);

  return (
    <div className={simulatorCls}>
      <FormattedMessage id={`app.home.components.simulator.${affix ? 'unaffix' : 'affix'}`}>
        {(txt) => (
          <div className="simulator__control" onClick={() => setAffix(!affix)} title={txt}>
            <Icons type="affix" size="sm" />
          </div>
        )}
      </FormattedMessage>
      <iframe ref={simulatorRef} src={`${window.location.protocol}//${window.location.host}/demo.html#/${params.component}`} title="simulator" frameBorder="0" />
    </div>
  );
};

const Page = () => {
  // const { general, form, feedback, view, navigation, other } = components;
  const params = useParams();

  const containerCls = classnames('main-container', 'markdown', {
    'no-simulator': !isComponentPage(params.component),
  });

  return (
    <Container className="components-page">
      <main>
        ok
        <Button />
        <div className={containerCls}>{Doc}</div>
        {/* <SideBar /> */}
        {/* {
          isComponentPage(params.component) && (
            <Simulator />
          )
        } */}
        {/* <div className={containerCls}>
          <Switch>
            {
              documents.map((doc, i) => (
                <Route key={+i} path={`/components/${doc.key}`} component={LoadableComponent(doc)} />
              ))
            }
            {
              [...general, ...form, ...feedback, ...view, ...navigation, ...other].map((component, i) => (
                <Route key={+i} path={`/components/${component.key}`} component={LoadableComponent(component)} />
              ))
            }
            <Redirect to="/" />
          </Switch>
        </div> */}
      </main>
      {/* <Footer /> */}
    </Container>
  );
};

export default Page;
