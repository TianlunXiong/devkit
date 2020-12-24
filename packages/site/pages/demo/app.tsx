import React from 'react';
import { Route, Switch } from 'react-router-dom';
import LoadComponent from '@loadable/component';
import DOCUMENT, { DocUnit } from '../../pages/web/docs';
import Container from './components/Container';
import { pascalCase } from 'change-case';
import Markdown from './components/Markdown';
import { Favicon } from '../web/components/Meta';
import './app.scss'
import 'mcore/style';
// import 'mcore/style-pc';

const { components } = DOCUMENT;

const LoadableMarkdown = (item: DocUnit) => {
  const { key, module, name } = item;
  const compName = pascalCase(key);
  import(`./styles/${compName}Page.scss`).catch(() => {
    
  })
  return LoadComponent(() => module().then(({ default: docStr }) => {
    function Wrapper() {
      return (
        <Container className={`${key}-page`}>
          <Markdown content={docStr} component={{ name, key }} />
        </Container>
      );
    }
    return Wrapper;
  }))
}

const Index = LoadComponent(() => import('./pages/Index'));

const App = () => {
  const { general, form, feedback, view, navigation, other } = components;
  return (
    <>
      <Switch>
        <Route exact path="/" component={Index} />
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
            path={`/${component.key}`}
            component={LoadableMarkdown(component)}
          />
        ))}
      </Switch>
      <Favicon />
    </>
  );
};

export default App;