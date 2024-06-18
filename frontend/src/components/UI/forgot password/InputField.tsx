import { ChangeEvent, FormEvent, useState } from 'react';

import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

type InputFieldProps = {
  title: 'Forgot Password' | 'Reset Password' | 'New Password';
  label: string;
  inputType: 'email' | 'number' | 'password';
  buttonLabel: string;
  onSubmit: (inputValue: string) => void;
  loading: boolean;
};

export default function InputField(props: InputFieldProps) {
  const [userInput, setUserInput] = useState('');
  const [isEmpty, setIsEmpty] = useState(false);

  function handleUserInputChange(event: ChangeEvent<HTMLInputElement>) {
    const newValue = event.currentTarget.value;

    setUserInput(newValue);
  }

  function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!userInput) return setIsEmpty(true);

    if (props.inputType === 'email')
      localStorage.setItem('recoveryEmail', userInput);

    props.onSubmit(userInput);
  }

  return (
    <Box
      component='form'
      sx={{
        '& > :not(style)': { m: 1, width: '40ch' },
      }}
      noValidate
      autoComplete='off'
      onSubmit={handleFormSubmit}
      className='flex flex-col justify-center items-center h-72'
    >
      <h1 className='text-center text-xl font-bold mb-4'>{props.title}</h1>
      <TextField
        type={props.inputType}
        id='outlined-basic'
        label={props.label}
        value={userInput}
        name={props.label.toLowerCase()}
        onChange={handleUserInputChange}
        error={isEmpty}
        helperText={isEmpty && `${props.label} is required*`}
        variant='outlined'
        required
      />
      <Button variant='contained' type='submit' disabled={props.loading}>
        {props.buttonLabel}
      </Button>
      {props.loading && (
        <CircularProgress
          size={24}
          sx={{
            position: 'absolute',
            top: '47%',
            left: '49%',
            marginTop: '-12px',
            marginLeft: '-12px',
          }}
        />
      )}
    </Box>
  );
}