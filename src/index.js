import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import Layout from './components/title.js'
// class Layout extends React.Component {
//   render(){
//     return (
//       <div>
//         <p>ankur</p>
//         <p>shukla</p>
//       </div>
//     );
//   }
// }
const app=document.getElementById('app')
ReactDOM.render(<Layout />, app);
