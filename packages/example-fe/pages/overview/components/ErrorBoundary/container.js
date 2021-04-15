import React from 'react';
import { Result } from 'antd';


export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({ hasError: true });
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, info);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <Result
          status="error"
          title={
            <div>
              {this.props.msg}
            </div>
          }
          extra="请联系管理员"
        />
      );
    }
    return this.props.children;
  }
}