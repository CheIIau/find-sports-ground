import TextField, { StandardTextFieldProps } from '@mui/material/TextField'
import { useState, ChangeEvent, useEffect, FunctionComponent, SetStateAction, Dispatch } from 'react'

interface Props extends StandardTextFieldProps {
  regex?: RegExp
  parentHandleChange: Dispatch<SetStateAction<string>>
}

const inputComponent: FunctionComponent<Props> = ({
  regex,
  parentHandleChange,
  ...props
}) => {
  const [value, setValue] = useState('')

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (regex) {
      return setValue(event.target.value.replace(regex, ''))
    }
    setValue(event.target.value)
  }

  useEffect(() => {
    parentHandleChange(value)
  }, [value])

  return (
    <div>
      <TextField
        value={value}
        onInput={handleChange}
        {...props}
        sx={{
          '& .MuiFormLabel-root': { color: 'white' },
          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'yellow' }
        }}
      />
    </div>
  )
}

export default inputComponent
