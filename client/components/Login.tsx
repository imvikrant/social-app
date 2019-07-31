import React, {useState, SetStateAction} from 'react'
import FormInput from './FormInput';
import './Login.scss'
import Button from '@material/react-button';
import AuthContext from '../contexts/AuthContext';

const renderFormInput = (
  label: string,
  value: string | number, 
  onValueChange: (value: SetStateAction<string> | SetStateAction<number>) => void
  ) : JSX.Element => (
  <FormInput 
    label={label}
    value={value}
    onChange={(e: React.FormEvent<HTMLInputElement>) => onValueChange(e.currentTarget.value)}
  />
)

const handleLogin = (logIn: () => void, email: string, password: string) => {
  console.log('instatiailng login')
  const formBody = new URLSearchParams()
  formBody.append('email', email)
  formBody.append('password', password)

  fetch('/login', {
    method: 'POST',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded" 
    },
    body: formBody,
  })
  .then((res) => res.json())
  .then((response) => {
    if (response.auth) {
      console.log(response)
      logIn();
    }
  })
}

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  
  return (
    <>
      {renderFormInput('Email', email, (newEmail : SetStateAction<string>) => setEmail(newEmail))}
      {renderFormInput('Password', password, (newPassword : SetStateAction<string>) => setPassword(newPassword))}
      <AuthContext.Consumer>
        {({logIn}) => (
          <Button
            className="login-button"
            outlined
            onClick={() => handleLogin(logIn, email, password)}
          > Login </Button>
        )}
      </AuthContext.Consumer>
    </>
  )
}

export default Login
