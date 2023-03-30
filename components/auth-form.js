import { useState, useRef } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';


async function createUser(username, password) {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong!');
  }

  return data;
}

function AuthForm() {
  const [registered, setRegistered] = useState(false)
  const usernameInputRef = useRef();
  const passwordInputRef = useRef();

  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
  }

  async function submitHandler(event) {
    event.preventDefault();

    const enteredUsername = usernameInputRef.current.value;
    const enteredPassword = passwordInputRef.current.value;

    // optional: Add validation

    if (isLogin) {
      await signIn('credentials', {
        redirect: '/',
        username: enteredUsername,
        password: enteredPassword,
      });

    } else {
      try {
        const result = await createUser(enteredUsername, enteredPassword);
        setRegistered(true)
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <section className='max-w-xl mx-auto my-7'>
      {!registered ? (
        <>
          <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
          <form onSubmit={submitHandler}>
            <div >
              <label htmlFor='username'>Your Username</label>
              <input type='text' id='username' required ref={usernameInputRef} />
            </div>
            <div >
              <label htmlFor='password'>Your Password</label>
              <input
                type='password'
                id='password'
                required
                ref={passwordInputRef}
              />
            </div>
            <div className='my-5'>
              <button className='button button-color mr-4'>{isLogin ? 'Login' : 'Create Account'}</button>
              <button
                type='button'

                onClick={switchAuthModeHandler}>
                {isLogin ? 'No Account? Create One' : 'Already a user? Login'}
              </button>
            </div>
          </form>
        </>
      ) : (
        <div className=''>
          <p>You have successfully registered!</p>
          
          <button onClick={() => router.reload()} className='button button-color'>Login Now</button>
          
        </div>
      )}
      
    </section>
  );
}

export default AuthForm;
