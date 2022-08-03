import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Head from 'next/head';
import { TextInput, Button, Stack, Title } from '@mantine/core';

import { handleError } from 'helpers';
import { accountApi } from 'resources/account';
import { magic } from 'libs/magic';

const schema = yup.object().shape({
  email: yup.string().email('Email format is incorrect.').required('Field is required.'),
});

const SignIn = () => {
  const {
    register, handleSubmit, formState: { errors }, setError,
  } = useForm({ resolver: yupResolver(schema) });

  const { mutate: signIn, isLoading: isSignInLoading } = accountApi.useSignIn();

  const handleSignInRequest = (data) => signIn(data, {
    onError: (e) => handleError(e, setError),
  });

  async function handleLoginWithEmail({ email }) {
    try {
      let DIDToken = await magic.auth.loginWithMagicLink({
        email,
        redirectURI: new URL('/magic-link-redirect', window.location.origin).href,
      });

      return handleSignInRequest({ DIDToken });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Head>
        <title>Sign in</title>
      </Head>
      <Stack sx={{ width: '328px' }}>
        <Title order={2}>Sign In</Title>
        <form onSubmit={handleSubmit(handleLoginWithEmail)}>
          <Stack>
            <TextInput
              {...register('email')}
              label="Email Address"
              placeholder="Email"
              error={errors?.email?.message}
            />
            <Button
              loading={isSignInLoading}
              type="submit"
              fullWidth
            >
              Sign in
            </Button>
          </Stack>
        </form>
      </Stack>
    </>
  );
};

export default SignIn;
