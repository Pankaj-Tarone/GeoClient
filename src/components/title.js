import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

import { Link } from 'react-router-dom';

const Title = styled.h1`
  color:blue;
  font-size:30px
`

class Layout extends React.Component {
  render(){
    console.log(this.props.children);
    return (
      <div>
        <Title>GeoClient</Title>
        <Title>{this.state} hi</Title>
        <Link to='/hello'>Home</Link>
      </div>
    );
  }
}

export default Layout;
