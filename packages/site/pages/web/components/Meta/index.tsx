import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import LOGO from '@/assets/images/logo.svg'

class Meta extends PureComponent {
  static propTypes = {
    title: PropTypes.string,
    description: PropTypes.string,
  };

  static defaultProps = {
    title: '',
    description: '',
  };

  render() {
    const { title, description } = this.props;
    return (
      <Helmet encodeSpecialCharacters={false}>
        <html lang="zh" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content={LOGO} />
      </Helmet>
    );
  }
}

export class Favicon extends PureComponent<{ src?: string }> {

  render() {
    const { src = LOGO } = this.props;
    return (
      <Helmet encodeSpecialCharacters={false}>
        <link rel="shortcut icon" href={src} type="image/svg"/>
      </Helmet>
    );
  }
}



export default Meta;
