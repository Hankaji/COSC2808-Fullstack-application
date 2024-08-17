import {
  Children,
  cloneElement,
  FC,
  HtmlHTMLAttributes,
  PropsWithChildren,
  ReactElement,
  ReactNode,
  useEffect,
  useState,
} from 'react';
import useDebounce from '../hooks/useDebounce';
import { mergeClassNames } from '../utils';

interface MenuProps extends PropsWithChildren {
  triggerType: 'click' | 'hover';
  asChild?: boolean;
  Content: ReactNode;
}

const DropDownMenu: FC<MenuProps> = ({
  children,
  triggerType,
  asChild = false,
  Content,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [isMouseIn, setIsMouseIn] = useState<boolean>(false);
  const debouncedMouseExit = useDebounce<boolean>(isMouseIn);

  const handleEnter = () => {
    if (triggerType !== 'hover') return;
    setIsMouseIn(true);
    setIsOpen(true);
  };

  const handleLeave = () => {
    if (triggerType !== 'hover') return;
    setIsMouseIn(false);
  };

  useEffect(() => {
    if (!debouncedMouseExit) setIsOpen(false);
  }, [debouncedMouseExit]);

  const handleClick = () => {
    if (triggerType !== 'click') return;
    setIsOpen((prev) => !prev);
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className={mergeClassNames(
        'relative',
        asChild ? '' : 'flex gap-2 hover:bg-secondary/50 rounded-lg p-2',
      )}
    >
      {children}
      {isOpen && Content}
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
        'flex gap-2 absolute top-[calc(100%+0.25rem)] left-0 mx-auto',
        'bg-background p-2 border-border bodeer-solid border-2 rounded-lg',
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
        'rounded-lg',
        !asChild && 'p-2 hover:bg-secondary',
      )}
    >
      {children}
    </div>
  );
};

export { DropDownMenu, DropDownMenuContent, DropDownItem };
