import { Globe, Mail, UserRound } from 'lucide-react';
import { mergeClassNames } from '../../../utils';
import PopupModal from '../../../components/PopupModal';

const GroupRightSide = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className={mergeClassNames('block-container flex-col')}>
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
      {/* Current role */}
      <div className="block-container">
        <img
          className="rounded-full bg-gray-500 size-12"
          src="https://preview.redd.it/lhxag30v58d31.jpg?width=640&crop=smart&auto=webp&s=bcf582e90ffb150dfd3f905fbfbe44deb30e56e6"
          alt="User avatar"
        />
        <div className="flex flex-col justify-center items-start">
          <h1 className="text-xl font-semibold">Admin</h1>
        </div>
      </div>
      {/* Actions */}
      <div className="block-container flex-col">
        <PopupModal
          heightPercent={0.8}
          className="w-full"
          modelRender={<Popup />}
        >
          <button className="flex gap-2 w-full items-center justify-center font-semibold rounded-lg bg-primary text-foreground py-2">
            <UserRound size={24} /> People
          </button>
        </PopupModal>
        <button className="flex gap-2 w-full items-center justify-center font-semibold rounded-lg bg-primary text-foreground py-2">
          <Mail size={24} /> Requests
        </button>
      </div>
    </div>
  );
};

const Popup = () => {
  return <div className="block-container flex-col size-full">sasas</div>;
};

export default GroupRightSide;
