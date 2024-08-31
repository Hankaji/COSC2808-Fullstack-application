import { Check, CircleAlert, Info, TriangleAlert, X } from 'lucide-react';
import {
  createContext,
  FC,
  PropsWithChildren,
  ReactNode,
  useState,
} from 'react';
import { mergeClassNames } from '../utils';

interface AppContext {
  show: (toast: ToastDetail, timeoutMs?: number) => void;
  showAsync: (
    promise: Promise<any>,
    toastOptions: {
      loading: AsyncToastDetail;
      success: (data: any) => AsyncToastDetail;
      error: (error: any) => AsyncToastDetail;
    },
  ) => void;
}

export const ToastContext = createContext<AppContext | undefined>(undefined);

type ToastType = 'default' | 'success' | 'info' | 'warning' | 'error';

interface ToastDetail {
  title: string;
  description?: string;
  type?: ToastType;
  action?: {
    label: string;
    onClick: () => void;
  };
}

type AsyncToastDetail = Omit<ToastDetail, 'type'>;

interface Toast {
  id: number;
  comp: ReactNode;
}

const ToastProvider: FC<PropsWithChildren> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const displayToast = (
    toast: ToastDetail,
    id: number,
    isAsync: boolean = false,
  ) => {
    const comp = <ToastComp detail={toast} useLoading={isAsync} />;

    setToasts((prev) => [...prev, { id, comp } as Toast]);
  };

  const show = (toast: ToastDetail, timeoutMs: number = 5000) => {
    const id = Date.now();

    displayToast(toast, id);

    setTimeout(() => closeToast(id), timeoutMs);
  };

  const showAsync = (
    promise: Promise<any>,
    toastOptions: {
      loading: AsyncToastDetail;
      success: (data: any) => AsyncToastDetail;
      error: (error: any) => AsyncToastDetail;
    },
  ) => {
    const id = Date.now();

    // Show loading toast
    displayToast(toastOptions.loading, id, true);

    promise
      .then((data) => {
        // Show success toast
        let toast = toastOptions.success(data) as ToastDetail;
        toast.type = 'success';
        show(toast);
      })
      .catch((error) => {
        // Show error toast
        let toast = toastOptions.error(error) as ToastDetail;
        toast.type = 'error';
        show(toast);
      })
      .finally(() => {
        // Close loading toast
        closeToast(id);
      });
  };

  const closeToast = (id: number) =>
    setToasts((prev) => prev.filter((toast) => toast.id !== id));

  return (
    <ToastContext.Provider value={{ show, showAsync }}>
      {children}
      <div className="space-y-2 absolute bottom-4 right-4">
        {toasts.map((toast, idx) => {
          return (
            <div key={toast.id} className="relative">
              {toast.comp}
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

interface ToastCompProps {
  detail: ToastDetail;
  useLoading?: boolean;
}

const ToastComp: FC<ToastCompProps> = ({ detail, useLoading }) => {
  const { type, title, description, action } = detail;

  const toastIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <Check />;
      case 'info':
        return <Info />;
      case 'warning':
        return <TriangleAlert />;
      case 'error':
        return <CircleAlert />;
    }
  };

  return (
    <div
      className={mergeClassNames(
        'flex items-center justify-start min-w-[400px] gap-4 p-4 rounded-lg shadow-md shadow-secondary/25 bg-background text-foreground',
        'border-border border-2 border-solid',
      )}
    >
      {/* Icon */}
      {type && type !== 'default' && toastIcon(type)}
      {useLoading && (
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {/* Info */}
      <div>
        <h1 className="truncate text-xl font-bold"> {title} </h1>
        <p className="truncate text-muted-foreground text-sm font-semibold">
          {description}
        </p>
      </div>
      {/* Action */}
      {action && (
        <button
          onClick={action.onClick}
          className="py-1 px-3 ml-auto hover:bg-secondary hover:text-foreground transition-colors bg-white text-background rounded-[6px]"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export type { ToastDetail };
export default ToastProvider;
