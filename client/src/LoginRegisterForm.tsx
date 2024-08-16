import {
  ButtonHTMLAttributes,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useRef,
  useState,
} from 'react';
import { Input } from './components/Input';

enum formState {
  LOGIN,
  SIGNUP,
}

interface loginProps {
  initialState?: formState;
}

const LoginRegisterForm = ({ initialState = formState.LOGIN }: loginProps) => {
  const [state, setState] = useState<formState>(initialState);

  const formRef = useRef<HTMLFormElement>(null);

  const handleLogin = () => {
    if (state != formState.LOGIN) {
      setState(formState.LOGIN);
      return;
    }
    formRef.current?.submit();
  };

  const handleSignUp = () => {
    if (state != formState.SIGNUP) {
      setState(formState.SIGNUP);
      return;
    }
    formRef.current?.submit();
  };

  return (
    <section className="relative flex w-svw h-svh items-center justify-center bg-background">
      {/* Random blob */}
      <div className="absolute top-[65%] left-[60%] -translate-x-1/2 -translate-y-1/2 size-[80vw] blur-3xl z-10 bg-primary opacity-5 rounded-full"></div>
      <form ref={formRef} className="z-20">
        <div className="p-12 border-solid rounded-lg shadow-lg shadow-card flex flex-col gap-16 bg-card">
          <div className="flex flex-col gap-2">
            <img
              className="size-12 object-cover mx-auto"
              style={{ maskSize: 'cover', WebkitMaskSize: 'cover' }}
              src="/logo.svg"
              alt="SnapMate logo"
            />
            <p className="font-bold text-xl">SnapMate</p>
          </div>
          <div className="flex flex-col gap-1">
            <p>Welcome</p>
            <h1 className="text-5xl font-bold">
              {state == formState.LOGIN ? 'Sign in now' : 'Sign up now'}
            </h1>
          </div>
          {/* Input prompt */}
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-2 items-start">
              <label htmlFor="email">Email</label>
              <Input
                className="p-4 py-6 rounded-lg w-[25vw]"
                type="text"
                name="email"
                id="email"
                placeholder="Enter your email"
              />
            </div>
            <div className="flex flex-col gap-2 items-start">
              <label htmlFor="password">Password</label>
              <Input
                className="p-4 py-6 rounded-lg w-[25vw]"
                type="password"
                name="password"
                id="password"
                placeholder="Enter your Password"
              />
            </div>
            {state == formState.SIGNUP && (
              <div className="flex flex-col gap-2 items-start">
                <label htmlFor="retype-password">Re-enter Password</label>
                <Input
                  className="p-4 py-6 rounded-lg w-[25vw]"
                  type="password"
                  name="retype-password"
                  id="retype-password"
                  placeholder="Re-enter your Password"
                />
              </div>
            )}
          </div>
          {state == formState.LOGIN ? (
            <p className="py-4">
              {' '}
              Don't have an account?{' '}
              <a onClick={handleSignUp} className="font-bold cursor-pointer">
                Register
              </a>{' '}
            </p>
          ) : (
            <p className="py-4">
              {' '}
              Already had an account?{' '}
              <a onClick={handleLogin} className="font-bold cursor-pointer">
                Login
              </a>{' '}
            </p>
          )}
          <Nav handleLogin={handleLogin} handleSignUp={handleSignUp} />
        </div>
      </form>
    </section>
  );
};

interface NavProps {
  handleLogin: () => void;
  handleSignUp: () => void;
}

type NavCursorPosition = {
  xpos: string;
  width: string;
};

const Nav = ({ handleLogin, handleSignUp }: NavProps) => {
  const [pos, setPos] = useState<NavCursorPosition>({
    xpos: '0',
    width: '50%',
  });

  return (
    <div className="relative flex gap-2 border-solid border-primary-500 border-2 rounded-full justify-center w-fit mx-auto">
      <NavItem setPos={setPos} onClick={handleLogin}>
        Sign in
      </NavItem>
      <NavItem setPos={setPos} onClick={handleSignUp}>
        Register
      </NavItem>
      <NavCursor pos={pos} />
    </div>
  );
};

interface NavItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  setPos: Dispatch<SetStateAction<NavCursorPosition>>;
  onClick: () => void;
}

const NavItem = ({
  setPos,
  onClick,
  children,
}: PropsWithChildren<NavItemProps>) => {
  const ref = useRef<HTMLButtonElement>(null);

  return (
    <button
      ref={ref}
      onClick={() => {
        onClick();

        if (!ref.current) return;

        const width = ref.current.getBoundingClientRect();

        setPos({
          xpos: ref.current.offsetLeft.toString(),
          width: `${width.width.toString()}px`,
        });
      }}
      className="z-10 py-4 px-20 rounded-full"
      type="button"
    >
      {children}
    </button>
  );
};

const NavCursor = ({ pos }: { pos: NavCursorPosition }) => {
  return (
    <div
      style={{
        transform: `translate(${pos.xpos}px, 0)`,
        width: `${pos.width}`,
      }}
      className="absolute h-full w-[100px] p-1 top-0 left-0 rounded-full transition-all duration-300"
    >
      <div className="h-full rounded-full bg-primary"></div>
    </div>
  );
};

export default LoginRegisterForm;
