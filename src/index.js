import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import Layout from './components/title.js';
import Features from './components/features.js';
import Map from './Map.js';
import Controller from './Controller.js'
import { EventEmitter } from 'events';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';

const root=document.getElementById('root')

ReactDOM.render(
  <div>
    <Controller/>
    <Map/>
  </div>
,root);