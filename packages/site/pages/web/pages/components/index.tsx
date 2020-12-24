import React, { useState, useContext, useRef, useEffect } from 'react';
import { Route, Switch, useParams } from 'react-router-dom';
import classnames from 'classnames';
import { FormattedMessage } from 'react-intl';
import Icon from 'mcore/icon';
import 'mcore/icon/style';
import LoadComponent from '@loadable/component';
import Context from '../../../../utils/context';
import Container from '../../components/Container';
import SideBar from '../../components/SideBar';
// import Footer from '@site/web/components/Footer';
import DOCUMENT, { DocUnit } from '../../docs';
import Markdown from '../../components/Markdown';

import './style.scss';

const { general, form, feedback, view, navigation, other } = DOCUMENT.components;
const documents = DOCUMENT.documents;

const isComponentPage = (page) => ['introduce', 'quick-start'].indexOf(page) === -1;

const LoadableMarkdown = (item: DocUnit) => {
  const { key, module, name } = item;
  return LoadComponent(() => module().then(({ default: docStr }) => {
    function Wrapper() {
      return <Markdown document={docStr} component={{ name, key }} />
    }
    return Wrapper;
  }))
}

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
      <iframe ref={simulatorRef} src={`${window.location.protocol}//${window.location.host}/demo#/${params.component}`} title="simulator" frameBorder="0" />
    </div>
  );
};

const Page = () => {
  const params = useParams();

  const containerCls = classnames('main-container', 'markdown', {
    'no-simulator': !isComponentPage(params.component),
  });

  return (
    <Container className="components-page">
      <main>
        <SideBar />
        {
          isComponentPage(params.component) && (
            <Simulator />
          )
        }
        <div className={containerCls}>
          <Switch>
            {documents.map((doc, i) => {
              console.log(`/components/${doc.key}`);
              return (
                <Route
                  key={+i}
                  path={`/components/${doc.key}`}
                  component={LoadableMarkdown(doc)}
                />
              );
            })}
            {[
              ...general,
              ...form,
              ...feedback,
              ...view,
              ...navigation,
              ...other,
            ].map((component, i) => (
              <Route
                key={+i}
                path={`/components/${component.key}`}
                component={LoadableMarkdown(component)}
              />
            ))}
            {/* <Redirect to="/" /> */}
          </Switch>
        </div>
      </main>
      {/* <Footer /> */}
    </Container>
  );
};

export default Page;
