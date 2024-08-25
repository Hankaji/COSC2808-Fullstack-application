import {
  Children,
  FC,
  HtmlHTMLAttributes,
  MouseEvent,
  MouseEventHandler,
  PropsWithChildren,
  ReactElement,
  useEffect,
  useState,
} from 'react';
import useDebounce from '../../hooks/useDebounce';
import { mergeClassNames } from '../../utils';

interface MenuProps extends PropsWithChildren {
  hoverable?: boolean;
  asChild?: boolean;
  content: ReactElement;
  className?: string;
}

const DropDownMenu: FC<MenuProps> = ({
  children,
  hoverable = 'click',
  asChild = false,
  content,
  className,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [isMouseIn, setIsMouseIn] = useState<boolean>(false);
  const debouncedMouseExit = useDebounce<boolean>(isMouseIn);

  const handleEnter = () => {
    if (!hoverable) return;
    setIsMouseIn(true);
    setIsOpen(true);
  };

  const handleLeave = () => {
    if (!hoverable) return;
    setIsMouseIn(false);
  };

  useEffect(() => {
    if (!debouncedMouseExit) setIsOpen(false);
  }, [debouncedMouseExit]);

  const handleClick = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="relative">
      <div
        onClick={(e) => {
          e.stopPropagation();
          handleClick();
        }}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        className={mergeClassNames(
          'relative',
          asChild
            ? ''
            : 'flex justify-center items-center size-fit gap-2 hover:bg-secondary/50 rounded-lg p-2',
          className,
        )}
      >
        {children}
      </div>
      {isOpen && content}
    </div>
  );
};

interface ContentProps extends HtmlHTMLAttributes<HTMLDivElement> {
  layout?: 'verticle' | 'horizontal';
}

const DropDownMenuContent: FC<ContentProps> = ({
  layout = 'verticle',
  className,
  ...props
}) => {
  return (
    <div
      {...props}
      className={mergeClassNames(
        'flex gap-2 absolute top-[calc(100%+0.25rem)] left-0',
        'bg-background p-2 border-border border-solid border-2 rounded-lg w-fit',
        // 'invisible opacity-0 transition-opacity duration-300',
        layout == 'verticle' ? 'flex-col' : '',
        className,
      )}
    >
      {props.children}
    </div>
  );
};

interface ItemProps extends PropsWithChildren {
  asChild?: boolean;
}

const DropDownItem: FC<ItemProps> = ({ children, asChild }) => {
  return (
    <div
      className={mergeClassNames(
        'rounded-sm w-full text-nowrap',
        !asChild && 'p-2 hover:bg-secondary',
      )}
    >
      {children}
    </div>
  );
};

export { DropDownMenu, DropDownMenuContent, DropDownItem };
