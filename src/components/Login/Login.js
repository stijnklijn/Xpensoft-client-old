import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import styles from './Login.module.css';
import Server from '../../utils/Server'
import {useValidation} from '../../hooks/useValidation';

export function Login({
    setJwt,
    email,
    password,
    newEmail,
    newPassword1,
    newPassword2,
    forgotPasswordEmail,
    dispatchCredentials}) {
        
    const [status, setStatus] = useState('login');
    const [message, setMessage] = useState({});

    const history = useHistory();

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

    const [handleEmailChange, handleEmailBlur, emailIsValid, emailHighlight] = useValidation(
        value => dispatchCredentials({type: 'SET_EMAIL', payload: value}),
        value => emailRegex.test(value) && value.length <= 50 && value.includes('@')
    );

    const [handlePasswordChange, handlePasswordBlur, passwordIsValid, passwordHighlight] = useValidation(
        value => dispatchCredentials({type: 'SET_PASSWORD', payload: value}),
        value => value.length >= 8 && value.length <= 50
    );

    const [handleNewEmailChange, handleNewEmailBlur, newEmailIsValid, newEmailHighlight] = useValidation(
        value => dispatchCredentials({type: 'SET_NEW_EMAIL', payload: value}),
        value => emailRegex.test(value) && value.length <= 50 && value.includes('@')
    );

    const [handleNewPassword1Change, handleNewPassword1Blur, newPassword1IsValid, newPassword1Highlight] = useValidation(
        value => dispatchCredentials({type: 'SET_NEW_PASSWORD_1', payload: value}),
        value => value.length >= 8 && value.length <= 50
    );
    
    const [handleNewPassword2Change, handleNewPassword2Blur, newPassword2IsValid, newPassword2Highlight] = useValidation(
        value => dispatchCredentials({type: 'SET_NEW_PASSWORD_2', payload: value}),
        value => value.length >= 8 && value.length <= 50
    );

    const [handleForgotPasswordEmailChange, handleForgotPasswordEmailBlur, forgotPasswordEmailIsValid, forgotPasswordEmailHighlight] = useValidation(
        value => dispatchCredentials({type: 'SET_FORGOT_PASSWORD_EMAIL', payload: value}),
        value => emailRegex.test(value) && value.length <= 50 && value.includes('@')
    );

    function handleLogin(e) {
        e.preventDefault();
        Server.login(email, password).then(res => {
            setJwt(res);
            history.push('/transactions');
        }).catch(err => {
            setMessage({message: 'Invalid combination of e-mail and password', error: true});
        })
    }

     function handleRegister(e) {
        e.preventDefault();
        if (newPassword1 !== newPassword2) {
            setMessage({message: 'Passwords do not match', error: true})
        }
        else {
            Server.register(newEmail.trim(), newPassword1.trim()).then(res => {
                setMessage({message: `Succesfully registered ${newEmail} as new user`, error: false});
                dispatchCredentials({type: 'RESET'});
            }).catch(err => {
                setMessage({message: 'That address is already registered', error: true});
            })
        }
    }

    function handleForgotPassword(e) {
        e.preventDefault();
        Server.getPassword(forgotPasswordEmail).then(res => {
            setMessage({message: `The password has been sent to ${forgotPasswordEmail}`, error: false});
            dispatchCredentials({type: 'RESET'});
        }).catch(err => {
            setMessage({message: 'That address is not registered', error: true});
        })
    }

    return (
        <div className={styles.login}>
            <h1>XPENSOFT</h1>
            {status === 'login' && <form>
                <h2>Login</h2>
                <br/>
                <label htmlFor='email'>E-mail</label>
                <input className={emailHighlight ? styles.invalid : styles.valid} type='email' id='email' value={email} onChange={e => handleEmailChange(e.target.value)} onBlur={handleEmailBlur}/>
                {emailHighlight && <p>Please provide a valid e-mail</p>}
                <label htmlFor='password'>Password</label>
                <input className={passwordHighlight ? styles.invalid: styles.valid} type='password' id='password' value={password} onChange={e => handlePasswordChange(e.target.value)} onBlur={handlePasswordBlur}/>
                {passwordHighlight && <p>Password must contain 8 to 50 characters</p>}
                <button className={styles['button-login']} disabled={!emailIsValid || !passwordIsValid} onClick={handleLogin}>Login</button>
                <p className={message.error? styles.error : styles.message}>{message.message}</p>
                <button className={styles['button-register']} onClick={e => {setMessage({}); setStatus('register')}}>Register</button>
          </form>}
          {status === 'register' && <form>
                <h2>Register</h2>
                <br/>
                <label htmlFor='newemail'>E-mail: </label>
                <input className={newEmailHighlight ? styles.invalid : styles.valid} type='email' id='newemail' value={newEmail} onChange={e => handleNewEmailChange(e.target.value)} onBlur={handleNewEmailBlur}/>
                {newEmailHighlight && <p>Please provide a valid e-mail</p>}
                <label htmlFor='newpassword1'>Password:</label>
                <input className={newPassword1Highlight ? styles.invalid : styles.valid} type='password' id='newpassword1' value={newPassword1} onChange={e => handleNewPassword1Change(e.target.value)} onBlur={handleNewPassword1Blur}/>
                {newPassword1Highlight && <p>Password must contain 8 to 50 characters</p>}
                <label htmlFor='newpassword2'>Repeat password:</label>
                <input className={newPassword2Highlight ? styles.invalid : styles.valid} type='password' id='newpassword2' value={newPassword2} onChange={e => handleNewPassword2Change(e.target.value)} onBlur={handleNewPassword2Blur}/>
                {newPassword2Highlight && <p>Password must contain 8 to 50 characters</p>}
                <p className={message.error? styles.error : styles.message}>{message.message}</p>
                <button disabled={!newEmailIsValid || !newPassword1IsValid || !newPassword2IsValid} onClick={handleRegister}>Register</button>
                <button onClick={e => {setMessage({}); setStatus('login')}}>Cancel</button>
          </form>}
          {status === 'get-password' && <form>
                <h2>Forgot password</h2>
                <br/>
                <label htmlFor='forgotpasswordemail'>E-mail: </label>
                <input className={forgotPasswordEmailHighlight ? styles.invalid : styles.valid} type='email' id='forgotpasswordemail' value={forgotPasswordEmail} onChange={e => handleForgotPasswordEmailChange(e.target.value)} onBlur={handleForgotPasswordEmailBlur}/>
                {forgotPasswordEmailHighlight && <p>Please provide a valid e-mail</p>}
                <p className={message.error? styles.error : styles.message}>{message.message}</p>
                <button disabled={!forgotPasswordEmailIsValid} onClick={handleForgotPassword}>Submit</button>
                <button onClick={e => {setMessage({}); setStatus('login')}}>Cancel</button>
            </form>}
        </div>
    );
}