import React, { useState, Fragment } from 'react'

const Field = ({ children }) => (
  <Fragment>
    {children}
    <br />
  </Fragment>
)

const Input = ({ value, onChange, ...props }) => (
  <input
    {...props}
    value={value}
    onChange={event => onChange(event.target.value)}
  />
)

const SubmitButton = props =>
  <button {...props}>submit</button>;

const UserForm = (props) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <Fragment>
      <Field>
        email: <Input value={email} onChange={setEmail} />
      </Field>
      <Field>
        password: <Input value={password} onChange={setPassword} type="password" />
      </Field>
      <SubmitButton onClick={() => props && props.onSubmit(email, password)} />
    </Fragment>
  )
}

export default UserForm