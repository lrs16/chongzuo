import React from 'react';

const withOrderFlow = () => WrappedComponent =>
  class extends React.Component {
    state = {
      computedHeight: 0,
    };

    handleRoot = node => {
      console.log(node)
    };

    render() {
      const { height } = this.props;
      const { computedHeight } = this.state;
      const h = height || computedHeight;
      return (
        <div ref={this.handleRoot}>{h > 0 && <WrappedComponent {...this.props} height={h} />}</div>
      );
    }
  };

export default withOrderFlow;