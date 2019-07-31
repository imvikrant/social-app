import React, {useState, SetStateAction} from 'react'
import FormInput from './FormInput'
import './Register.scss'
import AuthContext from '../contexts/AuthContext';
import Button from '@material/react-button';



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

const handleRegistration = (logIn: () => void, username: string, email: string, password: string) => {
  console.log('instatiailng registration')
  const formBody = new URLSearchParams()
  formBody.append('email', email)
  formBody.append('password', password)
  formBody.append('username', username)

  fetch('/register', {
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

const Register = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPasword] = useState('')

  
  return (
    <>
      {renderFormInput('Username', username, (newUsername : SetStateAction<string>) => setUsername(newUsername))}
      {renderFormInput('Email', email, (newEmail : SetStateAction<string>) => setEmail(newEmail))}
      {renderFormInput('Password', password, (newPassword : SetStateAction<string>) => setPassword(newPassword))}
      {renderFormInput('Confirm Password', confirmPassword, (newConfirmPassword : SetStateAction<string>) => setConfirmPasword(newConfirmPassword))}
      <AuthContext.Consumer>
        {({logIn}) => (
          <Button 
            className="register-button"
            outlined
            onClick={() => handleRegistration(logIn, username, email, password)}
          > Register </Button>
        )}
      </AuthContext.Consumer>
    </>
  )
}

export default Register
