import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';


const Feature = styled.h1`
  color:blue;
  font-size:30px
`
class Features extends React.Component {
  componentWillMount() {
    console.log('hi');
    this.props.history.push('/hello?true');
  }

  render() {
    return <div>hi</div>
  };
}

export default Features;