import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';


class Map extends React.Component {
  componentWillMount() {
    console.log('hi');
    this.props.history.push('/hello?true');
  }

  render() {
    return <div>hi</div>
  };
}

export default Features;
