import { Globe, Lock } from 'lucide-react';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Group, GroupVisibility } from '../types/group';

const CompactedGroup: FC<{ data: Group }> = ({ data }) => {
  return (
    <Link
      to={`/groups/${data.id}`}
      className="rounded-md flex gap-2 px-2 py-3 justify-start hover:bg-secondary/50 cursor-pointer transition-colors"
    >
      <div className="size-12 overflow-hidden rounded-full bg-gray-500">
        {data.groupImage && (
          <img
            className="object-cover size-12"
            src={data.groupImage}
            alt="Group"
          />
        )}
      </div>
      <div>
        <div className="flex items-center gap-2">
          <p className="text-base">{data.name}</p>
          {data.visibility === GroupVisibility.PUBLIC ? (
            <Globe size={16} />
          ) : (
            <Lock size={16} />
          )}
        </div>
        <p className="text-sm text-gray-500 line-clamp-2">{data.description}</p>
      </div>
    </Link>
  );
};

export default CompactedGroup;
