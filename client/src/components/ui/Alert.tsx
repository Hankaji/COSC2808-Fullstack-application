import { CircleAlert, CircleCheck, X } from 'lucide-react';
import { FC } from 'react';
import { mergeClassNames } from '../../utils';

interface AlertProps {
  type: 'success' | 'error';
  title: string;
  onRemove?: () => void;
  className?: string;
}

const Alert: FC<AlertProps> = ({ type, title, onRemove, className }) => {
  const icon = (() => {
    switch (type) {
      case 'success':
        return <CircleCheck size={16} className="stroke-green-900" />;
      case 'error':
        return <CircleAlert size={16} className="stroke-red-900" />;
    }
  })();

  return (
    <div
      className={mergeClassNames(
        'rounded py-2 px-3',
        type === 'success' ? 'bg-green-100' : 'bg-red-100',
        className,
      )}
    >
      <div className="flex items-center gap-2 justify-between">
        <div className="flex items-center gap-2">
          <div>{icon}</div>
          <p
            className={mergeClassNames(
              'text-sm',
              type === 'success' ? 'text-green-900' : 'text-red-900',
            )}
          >
            {title}
          </p>
        </div>
        {typeof onRemove === 'function' && (
          <div>
            <X
              size={16}
              className={mergeClassNames(
                'cursor-pointer',
                type === 'success' ? 'stroke-green-900' : 'stroke-red-900',
              )}
              onClick={onRemove}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;
