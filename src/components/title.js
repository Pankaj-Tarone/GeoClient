import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

const Title = styled.h1`
  color:blue;
  font-size:30px
`
class Layout extends React.Component {
  render(){
    return (
      <Title>GeoClient</Title>
    );
  }
}

export default Layout;
