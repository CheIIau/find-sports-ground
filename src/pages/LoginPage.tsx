import { Box, Button } from '@mui/material'
import { type StandardTextFieldProps } from '@mui/material/TextField'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import InputComponent from 'src/components/InputComponent/InputComponent'
import { useValidation } from 'src/hooks/validation'
import {
  useLazyLoginQuery,
  useRegisterMutation
} from 'src/services/UserService'

const generalProps: StandardTextFieldProps = {
  size: 'small',
  color: 'primary',
  required: true
}
const loginProps: StandardTextFieldProps = {
  ...generalProps,
  label: 'Email'
}
const passwordProps: StandardTextFieldProps = {
  ...generalProps,
  label: 'Password',
  type: 'password'
}

function loginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { validateInput, emailValidationRegex, emailTypingRegex } =
    useValidation()
  const navigate = useNavigate()
  const emailRules = [
    (val: string) =>
      val.length <= 30 ? false : 'Max number of characters is 30',
    (val: string) =>
      emailValidationRegex.test(val) ? false : 'Enter a valid email'
  ]
  const passwordRules = [
    (val: string) => (val.length >= 6 ? false : 'Min number of characters is 6')
  ]

  const validateEmail = useMemo(() => validateInput(email, emailRules), [email])
  const validatePassword = useMemo(
    () => validateInput(password, passwordRules),
    [password]
  )
  const disabledButton = useMemo(
    () => !!validateEmail || !!validatePassword,
    [password, email]
  )

  const [register] = useRegisterMutation()
  const [login] = useLazyLoginQuery()
  return (
    <div>
      <Box
        sx={{
          padding: '24px',
          border: 'solid 1px yellow',
          borderRadius: '10px'
        }}
      >
        <InputComponent
          regex={emailTypingRegex}
          parentHandleChange={setEmail}
          error={!!email ? !!validateEmail : false}
          helperText={email.length ? validateEmail : ''}
          style={{ marginBottom: '10px' }}
          {...loginProps}
        />
        <InputComponent
          error={!!password ? !!validatePassword : false}
          helperText={password.length ? validatePassword : ''}
          parentHandleChange={setPassword}
          {...passwordProps}
        />
        <Box display="flex" justifyContent="space-evenly" mt="24px">
          <Button
            variant="outlined"
            disabled={disabledButton}
            sx={{
              '&.Mui-disabled': {
                backgroundColor: '#A0A0A0'
              }
            }}
            onClick={() => {
              login({ email, password })
              navigate('/')
            }}
          >
            Sign in
          </Button>
          <Button
            variant="outlined"
            disabled={disabledButton}
            sx={{
              '&.Mui-disabled': {
                backgroundColor: '#A0A0A0'
              }
            }}
            onClick={() => {
              register({ email, password })
              navigate('/')
            }}
          >
            Sign up
          </Button>
        </Box>
      </Box>
    </div>
  )
}

export default loginPage
