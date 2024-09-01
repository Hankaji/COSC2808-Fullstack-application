import { Check, CircleAlert, Info, TriangleAlert, X } from 'lucide-react';
import {
  createContext,
  FC,
  PropsWithChildren,
  ReactNode,
  useState,
} from 'react';
import Loading from '../components/ui/Loading';
import { mergeClassNames } from '../utils';

interface AppContext {
  show: (toast: ToastDetail, timeoutMs?: number) => void;
  showAsync: (
    promise: () => Promise<any>,
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
    promise: () => Promise<any>,
    toastOptions: {
      loading: AsyncToastDetail;
      success: (data: any) => AsyncToastDetail;
      error: (error: any) => AsyncToastDetail;
    },
  ) => {
    const id = Date.now();

    // Show loading toast
    displayToast(toastOptions.loading, id, true);

    promise()
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

  // TODO: update styling for each case
  return (
    <div
      className={mergeClassNames(
        'flex items-center justify-start min-w-[400px] gap-4 p-4 rounded-lg shadow-md shadow-secondary/25 bg-background text-foreground',
        'border-border border-2 border-solid',
      )}
    >
      {/* Icon */}
      {type && type !== 'default' && toastIcon(type)}
      {useLoading && <Loading />}
      {/* Info */}
      <div>
        <h1 className="truncate text-lg">{title}</h1>
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
