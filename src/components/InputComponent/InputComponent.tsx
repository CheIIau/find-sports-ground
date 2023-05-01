import TextField, { type StandardTextFieldProps } from '@mui/material/TextField'
import {
  type ChangeEvent,
  type FunctionComponent,
  type SetStateAction,
  type Dispatch
} from 'react'

interface Props extends StandardTextFieldProps {
  regex?: RegExp
  setValue: Dispatch<SetStateAction<string>>
  inputValue: string
}

const inputComponent: FunctionComponent<Props> = ({
  regex,
  setValue,
  inputValue,
  ...props
}) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (regex) {
      setValue(event.target.value.replace(regex, ''))
      return
    }
    setValue(event.target.value)
  }

  return (
    <div>
      <TextField
        value={inputValue}
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
