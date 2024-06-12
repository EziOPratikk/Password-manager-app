/* eslint-disable react-hooks/exhaustive-deps */
import {
  type ChangeEvent,
  useState,
  type FormEvent,
  type ReactNode,
  useEffect,
} from 'react';

import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import PasswordStrengthBar from 'react-password-strength-bar';

type AuthenticationProps = {
  type: 'authentication';
  buttonLabel: string;
  buttonIcon: ReactNode;
  loading: boolean;
  onSave: (email: string, password: string) => void;
};

type PlatformProps = {
  type: 'platform';
  platformEmail?: string;
  platformPassword?: string;
  buttonLabel: string;
  buttonIcon: ReactNode;
  loading: boolean;
  onSave: (email: string, password: string) => void;
  onUpdate?: (email: string, password: string) => void;
};

type UserInput = {
  email: string;
  password: string;
};

export default function TextFormField(
  props: AuthenticationProps | PlatformProps
) {
  const [userInput, setUserInput] = useState<UserInput>({
    email: '',
    password: '',
  });
  const [isEmpty, setIsEmpty] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (props.type === 'platform') {
      setUserInput({
        email: props.platformEmail!,
        password: props.platformPassword!,
      });
    }
  }, [
    props.type,
    (props as PlatformProps).platformEmail,
    (props as PlatformProps).platformPassword,
  ]);

  function handleUserInputChange(event: ChangeEvent<HTMLInputElement>) {
    const newValue = event.currentTarget.value;
    const inputName = event.currentTarget.name;

    setUserInput((prevInput) => {
      return {
        ...prevInput,
        [inputName]: newValue,
      };
    });
  }

  function handleFormSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const userEmail = userInput.email;
    const userPassword = userInput.password;

    if (!userEmail || !userPassword) {
      setIsEmpty(true);
    } else if (
      !(props as PlatformProps).platformEmail &&
      !(props as PlatformProps).platformPassword
    ) {
      props.onSave(userEmail, userPassword);
    }

    if (props.type === 'platform') {
      if (props.platformEmail && props.platformPassword) {
        props.onUpdate!(userEmail, userPassword);
      }
    }
  }

  function handleClickShowPassword() {
    setShowPassword((show) => !show);
  }

  return (
    <Box
      component='form'
      sx={{
        '& > :not(style)': { m: 1, width: '40ch' },
      }}
      onSubmit={handleFormSubmit}
      noValidate
      autoComplete='off'
      className='flex flex-col items-center justify-center'
    >
      <TextField
        error={isEmpty}
        id='outlined-basic'
        label='Email'
        variant='outlined'
        type='email'
        name='email'
        value={userInput?.email}
        onChange={handleUserInputChange}
        fullWidth
        required
      />
      <FormControl sx={{ m: 1, width: '25ch' }} variant='outlined'>
        <InputLabel
          htmlFor='outlined-adornment-password'
          error={isEmpty}
          required
        >
          Password
        </InputLabel>
        <OutlinedInput
          error={isEmpty}
          id='outlined-adornment-password'
          type={showPassword ? 'text' : 'password'}
          name='password'
          value={userInput?.password}
          onChange={handleUserInputChange}
          fullWidth
          endAdornment={
            <InputAdornment position='end'>
              <IconButton
                aria-label='toggle password visibility'
                onClick={handleClickShowPassword}
                edge='end'
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          label='Password'
        />
      </FormControl>
      {userInput.password &&
        (props.buttonLabel === 'Register' || props.type === 'platform') && (
          <PasswordStrengthBar password={userInput.password} />
        )}
      <Box
        sx={{
          m: 1,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Button
          variant='contained'
          type='submit'
          startIcon={props.buttonIcon}
          disabled={props.loading}
        >
          {props.buttonLabel}
        </Button>
        {props.loading && (
          <CircularProgress
            size={24}
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              marginTop: '-12px',
              marginLeft: '-12px',
            }}
          />
        )}
      </Box>
    </Box>
  );
}