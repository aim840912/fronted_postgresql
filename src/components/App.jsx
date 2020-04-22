import React, { Component, Fragment } from 'react'
import FacebookIcon from '@material-ui/icons/Facebook';
import Button from '@material-ui/core/Button';
import Header from './Header'
import Footer from './Footer'
import LoginPage from './LoginPage'
import SignupPage from './SignupPage'
import PortfolioPage from './PortfolioPage'


class App extends Component {
    state = {
        isAuth: false,
        // isAuth:true,
        token: null,
        userId: null,
        error: null,
        posts: [],
        message: ""
    }

    componentDidMount() {
        const token = localStorage.getItem('token');
        const expiryDate = localStorage.getItem('expiryDate');

        if (!token || !expiryDate) {
            return;
        }

        this.loadPost(token)
        if (new Date(expiryDate) <= new Date()) {
            this.logoutHandler();
            return;
        }
        const userId = localStorage.getItem('userId');
        const remainingMilliseconds =
            new Date(expiryDate).getTime() - new Date().getTime();
        this.setState({ token: token, userId: userId });
        this.setAutoLogout(remainingMilliseconds);
    }

    loadPost = (token) => {
        fetch('/portfolio', {
            method: "GET",
            headers: {
                Authorization: 'Bearer ' + token
            }
        }).then(res => {
            if (res.status !== 200) {
                throw new Error('Failed to fetch')
            }
            return res.json()
        }).then(resData => {
            this.setState({
                posts: resData.successMessage.data,
                isAuth: true
            })
        }).catch(err => {
            console.log(err)
        })
    }

    // loginWithFb=()=>{
    //     fetch('/user/facebook',{
    //         method:'GET'
    //     })
    // }

    setAutoLogout = (milliseconds) => {
        setTimeout(() => {
            this.logoutHandler();
        }, milliseconds);
    };

    logoutHandler = () => {
        this.setState({ isAuth: false, token: null });

        localStorage.removeItem('token');
        localStorage.removeItem('expiryDate');
        localStorage.removeItem('userId');
    };

    loginHandler = (event, authData) => {
        event.preventDefault()
        fetch('/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: authData.email,
                password: authData.password
            })
        })
            .then((res) => {
                if (res.status === 422) {
                    throw new Error('Validation failed')
                }
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('Could not authenticate you')
                }
                return res.json()
            }).then(resData => {
                this.setState({
                    isAuth: true,
                    token: resData.successMessage.data.token,
                    authLoading: false,
                    userId: resData.successMessage.data.name
                });

                localStorage.setItem('token', this.state.token)
                localStorage.setItem('userId', this.state.userId)

                const remainingMilliseconds = 60 * 60 * 1000;
                const expiryDate = new Date(
                    new Date().getTime() + remainingMilliseconds
                );
                localStorage.setItem('expiryDate', expiryDate.toISOString());
                this.setAutoLogout(remainingMilliseconds);
            }).catch((err) => {
                console.log(err);
                this.setState({
                    isAuth: false,
                    authLoading: false,
                    error: err
                });
            });
    }

    signupHandler = (event, authData) => {
        event.preventDefault()
        // fetch('https://authapi-264513.appspot.com/auth/signup', {
        fetch('/user/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: authData.name,
                email: authData.email,
                password: authData.password
            })
        }).then(res => {
            if (res.status === 422) {
                throw new Error(
                    "Validation failed. Make sure the email address isn't used yet!"
                );
            }
            if (res.status !== 200 && res.status !== 201) {
                console.log('Error!');
                throw new Error('Creating a user failed!');
            }
            return res.json();
        }).then(resData => {
            console.log(resData)
            this.setState({
                token: resData.token,
                isAuth: true,
                userId: resData.name
            })
        }).catch(err => {
            console.log(err)
        });
    }


    render() {
        return <Fragment>
            <Header isLogin={this.state.isAuth} onLogout={this.logoutHandler} />
            {!this.state.isAuth ?
                (
                    <div>
                        <LoginPage onLogin={this.loginHandler} />
                        <SignupPage onSignup={this.signupHandler} />
                    </div>
                ) :

                <PortfolioPage token={this.state.token} />

            }
            <a href='http://localhost:8080/user/facebook'>
                <Button onClick={this.loginWithFb}  ><FacebookIcon /></Button>
            </a>
            <Footer />
        </Fragment >
    }
}

// <Button className="appButton" onClick={this.loginWithFb}><FacebookIcon /></Button>
export default App