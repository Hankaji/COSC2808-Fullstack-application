import {
  ButtonHTMLAttributes,
  ChangeEvent,
  Dispatch,
  FC,
  FormEvent,
  FormEventHandler,
  HTMLInputTypeAttribute,
  InputHTMLAttributes,
  PropsWithChildren,
  SetStateAction,
  useRef,
  useState,
} from 'react';
import { Input } from '../../components/Input';
import { mergeClassNames } from '../../utils';

enum formState {
  LOGIN,
  SIGNUP,
}

interface loginProps {
  initialState?: formState;
}

const LoginRegisterForm = ({ initialState = formState.LOGIN }: loginProps) => {
  const [state, setState] = useState<formState>(initialState);

  const [inputValues, setInputValues] = useState<Record<string, string>>({
    username: '',
    password: '',
  });

  const [errors, setErrors] = useState<string[]>([]);

  const inputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValues({ ...inputValues, [e.target.name]: e.target.value });
  };

  type formInputType = {
    id: number;
    name: string;
    type: HTMLInputTypeAttribute;
    placeholder: string;
    label: string;
    renderCondition: formState[];
  };

  const formInputs: formInputType[] = [
    {
      id: 1,
      name: 'username',
      type: 'text',
      placeholder: 'Username',
      label: 'Username',
      renderCondition: [formState.LOGIN, formState.SIGNUP],
    },
    {
      id: 2,
      name: 'password',
      type: 'password',
      placeholder: 'Password',
      label: 'Password',
      renderCondition: [formState.LOGIN, formState.SIGNUP],
    },
    {
      id: 3,
      name: 'repassword',
      type: 'password',
      placeholder: 'Retype password',
      label: 'Retype password',
      renderCondition: [formState.SIGNUP],
    },
  ];

  const formRef = useRef<HTMLFormElement>(null);

  const validateForm = (
    payload: Record<string, FormDataEntryValue>,
  ): boolean => {
    const errors: string[] = [];

    switch (state) {
      case formState.LOGIN: {
        if (!payload.username) errors.push('Username can not be empty');
        if (!payload.password) errors.push('Password can not be empty');
        break;
      }
      case formState.SIGNUP: {
        if (!payload.username) errors.push('Username can not be empty');
        if (!payload.password) errors.push('Password can not be empty');
        if (!payload.rePassword)
          errors.push('Retype password can not be empty');
        break;
      }
    }

    if (errors.length > 0) {
      setErrors(errors);
      return false;
    } else {
      return true;
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    validateForm(payload);
  };

  return (
    <section className="relative flex w-svw min-h-dvh items-center justify-center bg-background">
      {/* Random blob */}
      <div className="fixed top-0 left-0 h-svh w-svw overflow-hidden">
        <div className="absolute top-[65%] left-[60%] -translate-x-1/2 -translate-y-1/2 size-[80vw] blur-3xl z-10 bg-primary opacity-5 rounded-full"></div>
      </div>
      {/* Form */}
      <form ref={formRef} onSubmit={handleSubmit} className="z-20">
        <div className="p-12 border-solid rounded-lg shadow-lg shadow-card flex flex-col gap-16 bg-card">
          <div className="flex flex-col gap-2">
            <img
              className="size-12 object-cover mx-auto"
              style={{ maskSize: 'cover', WebkitMaskSize: 'cover' }}
              src="/logo.svg"
              alt="SnapMate logo"
            />
            <p className="font-bold text-xl text-center">SnapMate</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-center">Welcome</p>
            <h1 className="text-5xl font-bold text-center">
              {state == formState.LOGIN ? 'Sign in now' : 'Sign up now'}
            </h1>
          </div>
          {/* Input prompt */}
          <div className="flex flex-col gap-8">
            {formInputs.map((input) => {
              if (!input.renderCondition.includes(state)) return;
              return (
                <FormInput
                  key={input.id}
                  name={input.name}
                  type={input.type}
                  onChange={inputChange}
                  placeholder={input.placeholder}
                  label={input.placeholder}
                  value={inputValues[input.name]}
                />
              );
            })}
          </div>
          {/* Errors */}
          {errors.length > 0 && (
            <div className="flex flex-col gap-2 max-h-24 overflow-y-scroll">
              {errors.map((err, idx) => {
                return (
                  <span key={idx} className="text-danger">
                    * {err}
                  </span>
                );
              })}
            </div>
          )}
          {state == formState.LOGIN ? (
            <p className="py-4">
              Don't have an account?
              <a
                onClick={() => {
                  setErrors([]);
                  setState(formState.SIGNUP);
                }}
                className="font-bold cursor-pointer"
              >
                {' '}
                Register
              </a>
            </p>
          ) : (
            <p className="py-4">
              Already had an account?
              <a
                onClick={() => {
                  setErrors([]);
                  setState(formState.LOGIN);
                }}
                className="font-bold cursor-pointer"
              >
                {' '}
                Login
              </a>
            </p>
          )}
          <button type="submit" className="bg-primary py-4 px-20 rounded-full">
            Sign in
          </button>
        </div>
      </form>
    </section>
  );
};

interface FormInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {
  name: string;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  label: string;
  className?: string;
}

const FormInput: FC<FormInputProps> = ({
  name,
  type,
  placeholder,
  label,
  className,
  ...inputProps
}) => {
  return (
    <div
      className={mergeClassNames('flex flex-col gap-2 items-start', className)}
    >
      <label htmlFor="email">{label}</label>
      <Input
        {...inputProps}
        className="p-4 py-6 rounded-lg w-[25vw]"
        type={type}
        name={name}
        id={name}
        placeholder={placeholder}
      />
    </div>
  );
};

export default LoginRegisterForm;
