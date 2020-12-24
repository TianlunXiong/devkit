import React, { Component, ReactNode } from 'react';
import ReactDOM from 'react-dom';
import PropsType from './PropsType';
import Popup from '../popup';
import { getMountContainer } from '../utils/dom';

const contentIsToastProps = (content): content is ToastProps => typeof content === 'object' && 'content' in content;

export interface ToastProps extends PropsType {
  prefixCls?: string;
  className?: string;
}

export default class Toast extends Component<ToastProps, any> {
  static hideHelper: () => void;

  private static mcoreToast: HTMLDivElement | null;

  private static toastContainer: HTMLElement;

  static show = (
    content: ReactNode | ToastProps,
  ) => {
    Toast.unmountNode();
    if (!Toast.mcoreToast) {
      Toast.mcoreToast = document.createElement('div');
      Toast.mcoreToast.classList.add('mcore-toast-container');
      if (contentIsToastProps(content) && content.className) {
        Toast.mcoreToast.classList.add(content.className);
      }
      Toast.toastContainer = contentIsToastProps(content) ? getMountContainer(content.mountContainer) : getMountContainer();
      Toast.toastContainer.appendChild(Toast.mcoreToast);
    }
    if (Toast.mcoreToast) {
      const props = contentIsToastProps(content)
        ? { ...Toast.defaultProps, ...content, ...{ visible: true, mountContainer: Toast.mcoreToast } }
        : { ...Toast.defaultProps, ...{ visible: true, mountContainer: Toast.mcoreToast, content } };
      ReactDOM.render(
        <Toast {...props} />,
        Toast.mcoreToast,
      );
    }
  };

  static hide = () => {
    if (Toast.mcoreToast) {
      ReactDOM.render(
        <Toast visible={false} />,
        Toast.mcoreToast,
      );
    }
  };

  static unmountNode = () => {
    const { mcoreToast } = Toast;
    if (mcoreToast) {
      ReactDOM.render(<></>, mcoreToast);
      Toast.toastContainer.removeChild(mcoreToast);
      Toast.mcoreToast = null;
    }
  };

  private timer: number;

  static defaultProps: ToastProps = {
    prefixCls: 'mcore-toast',
    visible: false,
    stayTime: 3000,
    mask: false,
  };

  state = {
    visible: this.props.visible,
  };

  componentDidMount() {
    Toast.hideHelper = this._hide;
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
        clearTimeout(this.timer);
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
    if (Toast.mcoreToast) {
      Toast.toastContainer.removeChild(Toast.mcoreToast);
      Toast.mcoreToast = null;
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
    const {
      prefixCls,
      className,
      stayTime,
      content,
      ...others
    } = this.props;

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
          <div className={`${prefixCls}__container`}>{content}</div>
        </div>
      </Popup>
    );
  }
}
