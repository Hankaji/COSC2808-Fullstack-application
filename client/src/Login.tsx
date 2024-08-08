const Login = () => {
  return (
    <section className='flex w-svw h-svh items-center justify-center bg-primary-900'>
      <form>
        <div className='p-12 border-solid rounded-lg shadow-lg flex flex-col gap-8 bg-primary-800'>
          <div>
            <img src="idk" alt="Logo here" />
            <p className="font-bold text-xl">SnapMate</p>
          </div>
          <div className='flex flex-col gap-1'>
            <p>Welcome</p>
            <h1 className='text-5xl font-bold'>Sign in now</h1>
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
          </div>
          <p className="py-16"> Don't have an account? <a className="font-bold">Register</a> </p>
          <div className="p-1 flex gap-2 border-solid border-primary-500 border-2 rounded-full justify-center w-fit mx-auto">
            <button className="py-3 px-20 bg-secondary-500 rounded-full" type="button" >Sign in</button>
            <button className="py-3 px-20 rounded-full" type="button" >Register</button>
          </div>
        </div>
      </form>
    </section>
  )
}

export default Login
