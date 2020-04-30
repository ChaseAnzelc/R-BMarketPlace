import React from 'react';
import axios from 'axios';
import { Modal } from 'react-bootstrap';

var loadjs = require('loadjs');

class ForgotPassword extends React.Component {
    componentDidMount() {
        loadjs('main.js');
    }

    constructor(props) {
        super(props);
        this.state = {
            userEmail: '',
            userToken: '',
            newPassword: '',
            confirmPassword: '',
            postEmailInput: false,
            showMatch: false,
            success: false
        }
    }

    onChangeHandler = e => {
        e.preventDefault();
        let name = e.target.name;
        let val = e.target.value;
        let err = '';

        this.setState({ errorMessage: err });
        this.setState({ [name]: val });
    }

    handleMatchModal = e => {
        this.setState({ showMatch: !this.state.showMatch });
    }

    handleSuccess = e => {
        this.setState({ success: !this.state.success });
    }

    submitHandler = e => {
        e.preventDefault();
        this.getToken();
    }

    resetHandler = e => {
        e.preventDefault();
        this.resetPassword();
    }

    resetPassword() {
        if (this.state.userToken !== undefined || this.state.userEmail !== undefined
            || this.state.newPassword !== undefined || this.state.confirmPassword !== undefined) {
            if (this.state.newPassword !== this.state.confirmPassword) {
                this.handleMatchModal();
            } else {
                axios({
                    method: 'POST',
                    url: 'users/resetpassword',
                    data: {
                        email: this.state.userEmail,
                        emailToken: this.state.userToken,
                        newPassword: this.state.newPassword
                    }
                }).then((response) => {
                    if (response.status === 200) {
                        this.handleSuccess();
                        window.location.href = "./";
                    }
                }, error => {
                    alert(error.response.data);
                });
            }
        }
        else {
            window.alert("Error: Please fill out all of the input boxes.");
            window.location.href = '/';
        }
    }
    getToken() {
        if (this.state.userEmail !== undefined) {
            axios({
                method: 'POST',
                url: 'users/reemail',
                data: {
                    email: this.state.userEmail
                }
            }).then((response) => {
                if (response.status === 200) {
                    alert(response.data);
                    this.setState({ postEmailInput: true })
                }
            }, error => {
                alert(error.response.data);
            });
        }
        else {
            window.alert("Error: Please fill out the email address.");
            window.location.href = '/';
        }
    }

    render() {
        return (
            <div className="container">
                <Modal show={this.state.showMatch}>
                    <Modal.Header className="bg-danger">
                        Error
                    </Modal.Header>
                    <Modal.Body>
                        The passwords do not match.
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn btn-danger" onClick={() => { this.handleMatchModal() }}>
                            Close
                        </button>
                    </Modal.Footer>
                </Modal>
                <Modal show={this.state.success}>
                    <Modal.Header className="bg-success">
                        Success
                    </Modal.Header>
                    <Modal.Body>
                        Successfully reset password!
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn btn-success" onClick={() => { this.handleSuccess() }}>
                            Close
                        </button>
                    </Modal.Footer>
                </Modal>
                <h1 className='text-center'>Forgot your password?</h1>
                <form method="post" encType="multipart/form-data" className="form-horizontal mt-4 contact-form" onSubmit={this.submitHandler}>
                    <div className="row" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div className="col-12 col-sm-12">
                            <label><b>Email address</b></label>
                            <input type="text" onChange={this.onChangeHandler} className="form-control" name="userEmail" required autoComplete="off" />
                        </div>
                    </div>
                    <button type="submit" style={resendButton} className="btn btn-block mt-3 mb-3">Get token</button>
                </form>
                <form method="post" encType="multipart/form-data" className="form-horizontal mt-4 contact-form" onSubmit={this.resetHandler}>
                    {
                        this.state.postEmailInput ? //making these visible after the token is successfully sent
                            <div>
                                <div className="row" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <div className="col-12 col-sm-12">
                                        <label><b>Password Reset Token</b></label>
                                        <input type="text" onChange={this.onChangeHandler} className="form-control" name="userToken" required autoComplete="off" />
                                    </div>
                                </div>
                                <div className="row" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <div className="col-12 col-sm-12">
                                        <label><b>New Password</b></label>
                                        <input type="password" onChange={this.onChangeHandler} className="form-control" name="newPassword" required autoComplete="off" />
                                    </div>
                                </div>
                                <div className="row" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <div className="col-12 col-sm-12">
                                        <label><b>Confirm Password</b></label>
                                        <input type="password" onChange={this.onChangeHandler} className="form-control" name="confirmPassword" required autoComplete="off" />
                                    </div>
                                </div>
                                <button type="submit" style={verifyButton} className="btn btn-block mt-3">Confirm Reset</button>
                            </div>
                            : null
                    }
                </form>
               
            </div>
        );
    }
}

export default ForgotPassword;

const verifyButton = {
    backgroundColor: '#31ce51'
}
const resendButton = {
    backgroundColor: '#1a69b8'
}
