import React from 'react'
import TextField, { Input } from '@material/react-text-field'
import './FormInput.scss'

interface IFormInputProps {
  label: string;
  value: string | number;
  onChange: (e : React.FormEvent<HTMLInputElement>) => void;
}

const FormInput = ({label, value, onChange} : IFormInputProps) => (
  <TextField
    className="form-input" 
    label={label}
    outlined
  >
    <Input 
      value={value}
      onChange={onChange}
    />
  </TextField>
)


export default FormInput
