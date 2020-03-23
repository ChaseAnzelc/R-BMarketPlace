import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Header from './components/layouts/Header';
import Navbar from './components/layouts/Navbar';
import Footer from './components/layouts/Footer';
import SignUp from './components/pages/Signup';
import HomePage from './components/pages/HomePage';
import AddProduct from './components/pages/AddProduct';
import ForSale from './components/pages/ForSale';
import ForRent from './components/pages/ForRent';
import VerifyEmail from './components/pages/VerifyEmail';

import './App.css';
var email = "";

class App extends React.Component {
  componentDidMount() {
    if (localStorage.getItem('token') !== null) {
      axios({
        method: 'POST',
        url: 'users/authToken',
        headers: {
          "Content-Type": "application/json",
          'token': localStorage.getItem('token')
        }
      }).then((response) => {
        email = response.data.email;
        console.log("Email: " + email);
      }).catch((error) => {
        localStorage.clear();
      });
    }
  }

  render() {
    return (
      <Router>
        <Route exact path="/" render={props => (
          <div>
            <Header />
            <Navbar />
            <HomePage />
            <Footer />
          </div>
        )} />
        <Route path="/Signup" render={props => (
          <div>
            <Navbar />
            <SignUp />
            <Footer />
          </div>
        )} />
        <AddProductPage />
        <Route path="/VerifyEmail" render={props => (
          <div>
            <Navbar />
            <div style={outerStyle}>
              <VerifyEmail />
            </div>
            <Footer />
          </div>
        )} />
        <Route path="/ForSale" render={props => (
          <div>
            <Navbar />
            <ForSale />
            <Footer />
          </div>
        )} />
        <Route path="/ForRent" render={props => (
          <div>
            <Navbar />
            <ForRent />
            <Footer />
          </div>
        )} />
      </Router>
    );
  }
}

export default App;

const outerStyle = {
  backgroundImage: 'linear-gradient(rgba(255,255,255,0.5), rgba(255,255,255,0.5)), url("../houses-banner.jfif")',
  backgroundSize: 'cover',
  width: '100%',
  height: '100vh'
}

function AddProductPage(props) {
  if (localStorage.getItem('token') !== null) {
    return (
      <Route path="/AddProduct" render={props => (
        <div>
          <Navbar />
          <div style={outerStyle}>
            <AddProduct />
          </div>
          <Footer />
        </div>
      )} />
    )
  } else {
    return <React.Fragment></React.Fragment>
  }
}
