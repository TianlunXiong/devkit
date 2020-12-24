import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import PropsType from './PropsType';
import Popup from '../popup';
import { getMountContainer } from '../utils/dom';
import ActivityIndicator from '../activity-indicator';

export interface LoadingProps extends PropsType {
  prefixCls?: string;
  className?: string;
}

export default class Loading extends PureComponent<LoadingProps, {}> {
  static defaultProps: LoadingProps = {
    prefixCls: 'mcore-loading',
    mask: true,
  };

  static mcoreLoading: HTMLElement | null;

  private static loadingContainer: HTMLElement;

  static hideHelper: () => void;

  static show = (content: LoadingProps) => {
    Loading.unmountNode();
    if (!Loading.mcoreLoading) {
      Loading.mcoreLoading = document.createElement('div');
      Loading.mcoreLoading.classList.add('mcore-loading-container');
      if (content && content.className) {
        Loading.mcoreLoading.classList.add(content.className);
      }
      Loading.loadingContainer = content ? getMountContainer(content.mountContainer) : getMountContainer();
      Loading.loadingContainer.appendChild(Loading.mcoreLoading);
    }
    if (Loading.mcoreLoading) {
      const props = { ...Loading.defaultProps, ...content as LoadingProps, ...{ visible: true, mountContainer: Loading.mcoreLoading } };
      ReactDOM.render(
        <Loading {...props} />,
        Loading.mcoreLoading,
      );
    }
  };

  static hide = () => {
    if (Loading.mcoreLoading) {
      ReactDOM.render(
        <Loading visible={false} />,
        Loading.mcoreLoading,
      );
    }
  };

  static unmountNode = () => {
    const { mcoreLoading } = Loading;
    if (mcoreLoading) {
      ReactDOM.render(<></>, mcoreLoading);
      Loading.loadingContainer.removeChild(mcoreLoading);
      Loading.mcoreLoading = null;
    }
  };

  private timer;

  state = {
    visible: this.props.visible,
  };

  componentDidMount() {
    Loading.hideHelper = this._hide;
    this.autoClose();
  }

  componentDidUpdate(prevProps) {
    const { visible } = this.props;

    if (prevProps.visible !== visible) {
      if (visible === true) {
        // eslint-disable-next-line
        this.setState({
          visible: true,
        });
        this.autoClose();
      } else {
        this._hide();
      }
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  afterClose = () => {
    const { afterClose } = this.props;
    if (Loading.mcoreLoading) {
      Loading.loadingContainer.removeChild(Loading.mcoreLoading);
      Loading.mcoreLoading = null;
    }

    if (typeof afterClose === 'function') {
      afterClose();
    }
  };

  _hide = () => {
    this.setState({
      visible: false,
    });
  };

  autoClose() {
    const { stayTime } = this.props;

    if ((stayTime as number) > 0) {
      this.timer = setTimeout(() => {
        this._hide();
        clearTimeout(this.timer);
      }, stayTime);
    }
  }

  render() {
    const { prefixCls, content, stayTime, className, ...others } = this.props;
    const { visible } = this.state;
    return (
      <Popup
        direction="center"
        maskType="transparent"
        width="70%"
        {...others}
        visible={visible}
        afterClose={this.afterClose}
      >
        <div className={prefixCls}>
          <div className={`${prefixCls}__container`}>{content || <ActivityIndicator type="spinner" size="lg" />}</div>
        </div>
      </Popup>
    );
  }
}
