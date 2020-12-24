import React, { useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { transform } from '@babel/standalone';
import  Panel  from 'mcore/panel';
import { en_US, zh_CN } from 'mcore/locale-provider';

export default ({ location, lang, children }) => {
  const containerId = `${parseInt(Math.random() * 1e9, 10).toString(36)}`;
  const document = children.match(/([^]*)\n?(```[^]+```)/);
  const title = String(document[1]);
  const containerRef = useRef();

  const renderSource = useCallback(() => {
    const source = document[2].match(/```(.*)\n?([^]+)```/);
    const locale = lang === 'enUS'
      ? en_US
      : zh_CN;

    import('mcore').then((Element) => {
      const args = ['context', 'React', 'ReactDOM', 'mcore'];
      const argv = [this, React, ReactDOM, Element];

      return {
        args,
        argv,
      };
    }).then(({ args, argv }) => {
      const value = source[2]
        .replace(/import\s+\{\s+(.*)\s+\}\s+from\s+'react';/, 'const { $1 } = React;')
        .replace(/import\s+\{\s+(.*)\s+\}\s+from\s+('mcore'|'mcore');/, 'const { $1 } = mcore;')
        .replace(/ReactDOM.render\(\s?([^]+?)(,\s?mountNode\s?\))/g, `
          ReactDOM.render(
            <mcore.LocaleProvider locale={${JSON.stringify(locale)}}>
              $1
            </mcore.LocaleProvider>,
            document.getElementById('${containerId}'),
          )
        `);

        
      const { code } = transform(value, {
        presets: ['es2015', 'react'],
        plugins: ['proposal-class-properties'],
      });

      args.push(code);
      // eslint-disable-next-line
      new Function(...args)(...argv);
      // source[2] = value;
    }).catch((err) => {
      if (process.env.NODE_ENV !== 'production') {
        throw err;
      }
    });
  }, [containerId, document, lang]);

  useEffect(() => {
    const container = containerRef.current;
    renderSource();

    return function cleanup() {
      container && ReactDOM.unmountComponentAtNode(container);
    };
  }, [renderSource]);

  // Panel的例子特殊处理
  return (location.pathname === '/panel')
    ? <div id={containerId} ref={containerRef} />
    : (
      <Panel title={title}>
        <div id={containerId} ref={containerRef} />
      </Panel>
    );
};
