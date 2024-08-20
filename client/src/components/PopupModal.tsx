import { FC, PropsWithChildren, ReactNode, useState } from 'react';
import { mergeClassNames } from '../utils';

interface PopupModalProps extends PropsWithChildren {
  widthPercent?: number;
  heightPercent?: number;
  className?: string;
  backdropBlur?: Number;
  modelRender: ReactNode;
}

const PopupModal: FC<PopupModalProps> = ({
  widthPercent = 0.5,
  heightPercent = 0.5,
  className,
  backdropBlur = 0,
  modelRender,
  children,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <div
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(true);
        }}
        className={mergeClassNames(className)}
      >
        {children}
      </div>
      {/* Popup */}
      {isOpen && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(false);
          }}
          className="fixed top-0 left-0 w-svw h-svh flex justify-center items-center"
        >
          <div
            style={{
              width: `${widthPercent * 100}%`,
              height: `${heightPercent * 100}%`,
            }}
            className=""
          >
            {modelRender}
          </div>
        </div>
      )}
    </>
  );
};

export default PopupModal;
