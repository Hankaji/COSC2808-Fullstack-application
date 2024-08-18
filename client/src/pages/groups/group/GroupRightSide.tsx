import { Globe } from 'lucide-react';
import { mergeClassNames } from '../../../utils';

const GroupRightSide = () => {
  return (
    <div
      className={mergeClassNames(
        'flex flex-col p-4 gap-4',
        'border-border border-2 border-solid rounded-lg',
      )}
    >
      {/* Group Description */}
      <div className="flex flex-col">
        <h1 className="font-bold text-lg">
          g/Punixorn - the home for cunny NIXXER!
        </h1>
        <p>
          Submit screenshots of all your *NIX desktops, themes, and nifty
          configurations, or submit anything else that will make ricers happy.
          Maybe a server running on an Amiga, or a Thinkpad signed by Bjarne
          Stroustrup? Show the world how pretty your computer can be!
        </p>
      </div>
      {/* Visibility */}
      <p className="flex gap-2 items-center justify-center font-semibold rounded-lg bg-secondary py-2">
        <Globe size={24} /> Public group
      </p>
      {/* Members */}
      <div className="flex gap-2">
        <div className="flex flex-col w-full">
          <h2 className="font-bold">487K</h2>
          <p className="text-muted">Members</p>
        </div>
        <div className="flex flex-col w-full">
          <h2 className="font-bold">911</h2>
          <p className="text-muted flex gap-2 items-center">
            <div className="size-2 bg-success rounded-full"></div> Online
          </p>
        </div>
      </div>
    </div>
  );
};

export default GroupRightSide;
