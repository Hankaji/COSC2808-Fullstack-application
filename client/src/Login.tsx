import { useRef, useState } from "react"

enum formState {
  LOGIN,
  SIGNUP
}

interface loginProps {
  initialState?: formState
}

const Login = ({ initialState = formState.LOGIN }: loginProps) => {

  const [state, setState] = useState<formState>(initialState)

  const formRef = useRef<HTMLFormElement>(null)

  const handleLogin = () => {
    if (state != formState.LOGIN) {
      setState(formState.LOGIN)
      return
    }
    formRef.current?.submit()
  }


  const handleSignUp = () => {
    if (state != formState.SIGNUP) {
      setState(formState.SIGNUP)
      return
    }
    formRef.current?.submit()
  }

  return (
    <section className='relative flex w-svw h-svh items-center justify-center bg-primary-900'>
      {/* Random blob */}
      <div className="absolute top-[65%] left-[60%] -translate-x-1/2 -translate-y-1/2 size-[80vw] blur-3xl z-10 bg-primary-300 opacity-5 rounded-full"></div>
      <form ref={formRef} className="z-20">
        <div className='p-12 border-solid rounded-lg shadow-lg shadow-primary-800 flex flex-col gap-16 bg-primary-800'>
          <div className="flex flex-col gap-2">
            <img className="size-12 object-cover mx-auto" style={{ maskSize: "cover", WebkitMaskSize: "cover" }} src="/logo.svg" alt="Logo here" />
            <p className="font-bold text-xl">SnapMate</p>
          </div>
          <div className='flex flex-col gap-1'>
            <p>Welcome</p>
            <h1 className='text-5xl font-bold'>{state == formState.LOGIN ? 'Sign in now' : 'Sign up now'}</h1>
          </div>
          {/* Input prompt */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2 items-start">
              <label htmlFor="email" >Email</label>
              <input className="p-4 rounded-lg w-[25vw]" type="text" name="email" id="email" placeholder="Enter your email" />
            </div>
            <div className="flex flex-col gap-2 items-start">
              <label htmlFor="password" >Password</label>
              <input className="p-4 rounded-lg w-[25vw]" type="text" name="password" id="password" placeholder="Enter your Password" />
            </div>
            {state == formState.SIGNUP &&
              <div className="flex flex-col gap-2 items-start">
                <label htmlFor="retype-password" >Re-enter Password</label>
                <input className="p-4 rounded-lg w-[25vw]" type="text" name="retype-password" id="retype-password" placeholder="Re-enter your Password" />
              </div>
            }
          </div>
          {state == formState.LOGIN ?
            <p className="py-4"> Don't have an account? <a onClick={handleSignUp} className="font-bold cursor-pointer">Register</a> </p> :
            <p className="py-4"> Already had an account? <a onClick={handleLogin} className="font-bold cursor-pointer">Login</a> </p>
          }
          <div className="p-1 flex gap-2 border-solid border-primary-500 border-2 rounded-full justify-center w-fit mx-auto">
            <button onClick={handleLogin} className="py-3 px-20 bg-secondary-500 rounded-full" type="button" >Sign in</button>
            <button onClick={handleSignUp} className="py-3 px-20 rounded-full" type="button" >Register</button>
          </div>
        </div>
      </form>
    </section>
  )
}

export default Login
