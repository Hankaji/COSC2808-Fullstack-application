import { Check, Globe, Lock, Mail, Trash, UserRound } from 'lucide-react';
import { mergeClassNames } from '../../../utils';
import PopupModal from '../../../components/PopupModal';
import { FC, ReactElement, useEffect, useState } from 'react';
import { useLoaderData, useParams } from 'react-router';
import { Group, GroupVisibility } from '../../../types/group';
import { parseBasicUser, User } from '../../../types/post';
import { URL_BASE } from '../../../config';
import { AuthorPfp } from '../../../components/Post';
import useAuth from '../../../hooks/useAuth';
import Loading from '../../../components/ui/Loading';
import useToast from '../../../hooks/useToast';

const GroupRightSide = () => {
  const groupData = useLoaderData() as Group;
  const { auth } = useAuth();

  const [admins, setAdmins] = useState<User[]>([]);

  const isGroupAdmin = (): boolean => {
    for (let admin of admins) {
      if (admin.id === auth.user!.userId) {
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    const fetchAdmins = async () => {
      const endpoint = `${URL_BASE}/groups/${groupData.id}/admins`;
      const res = await fetch(endpoint, {
        method: 'GET',
        credentials: 'include',
      });

      const data: any[] = await res.json();
      const adminsData = data.map((user) => {
        return parseBasicUser(user);
      });
      setAdmins(adminsData);
    };

    fetchAdmins();
  }, []);

  const showPopup = (tab: number) => {
    return <Popup initialTab={tab} isGroupAdmin={isGroupAdmin()} />;
  };

  return (
    <div className="flex flex-col gap-4">
      <div className={mergeClassNames('block-container flex-col')}>
        {/* Group Description */}
        <div className="flex flex-col">
          <h1 className="font-bold text-lg">{groupData.name}</h1>
          <p>
            {groupData.description
              ? groupData.description
              : 'No description was provided'}
          </p>
        </div>
        {/* Visibility */}
        <p className="flex gap-2 items-center justify-center font-semibold rounded-lg bg-secondary py-2">
          {groupData.visibility === GroupVisibility.PUBLIC ? (
            <>
              <Globe size={24} /> Public group
            </>
          ) : (
            <>
              <Lock size={24} /> Private
            </>
          )}
        </p>
        {/* Members */}
        <div className="flex gap-2">
          <div className="flex flex-col w-full">
            <h2 className="font-bold">{groupData.members.length}</h2>
            <p className="text-muted">Members</p>
          </div>
          <div className="flex flex-col w-full">
            <h2 className="font-bold">{groupData.admins.length}</h2>
            <p className="text-muted flex gap-2 items-center">Moderators</p>
          </div>
        </div>
      </div>
      {/* Current role */}
      <div className="block-container flex-col">
        <h1 className="text-2xl font-bold">Moderators</h1>
        {/* Display only 3 moderators max */}
        {admins.slice(0, 3).map((admin) => (
          <AuthorPfp key={admin.id} data={admin} />
        ))}
      </div>
      {/* Actions */}
      <div className="block-container flex-col">
        <PopupModal
          heightPercent={0.8}
          className="w-full"
          modelRender={showPopup(0)}
        >
          <button className="flex gap-2 w-full items-center justify-center font-semibold rounded-lg bg-primary text-foreground py-2">
            <UserRound size={24} /> People
          </button>
        </PopupModal>
        {isGroupAdmin() && (
          <PopupModal
            heightPercent={0.8}
            className="w-full"
            modelRender={showPopup(1)}
          >
            <button className="flex gap-2 w-full items-center justify-center font-semibold rounded-lg bg-primary text-foreground py-2">
              <Mail size={24} /> Requests
            </button>
          </PopupModal>
        )}
      </div>
    </div>
  );
};

const Popup: FC<{ initialTab?: number; isGroupAdmin?: boolean }> = ({
  initialTab = 0,
  isGroupAdmin = false,
}) => {
  const [selectedTab, setSelectedTab] = useState<number>(initialTab);

  const tabs: string[] = ['People', 'Requests'];
  const requireAdminAccess: boolean[] = [false, true];
  const tabNodes: ReactElement[] = [<ViewAllPeople />, <ViewRequests />];

  if (requireAdminAccess[selectedTab] && !isGroupAdmin) {
    setSelectedTab(0);
  }

  return (
    <div className="block-container flex-col size-full">
      {/* Tab selection */}
      <div className="flex">
        {tabs.map((name, idx) => {
          if (requireAdminAccess[idx] && !isGroupAdmin) return;
          return (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedTab(idx);
              }}
              className={mergeClassNames(
                'flex p-4 justify-center items-center w-full',
                'hover:bg-secondary transition-colors rounded-tl-lg rounded-tr-lg border-border',
                selectedTab == idx && 'border-b-2 border-solid',
              )}
              key={idx}
            >
              {name}
            </button>
          );
        })}
      </div>
      {/* Content */}
      {tabNodes[selectedTab]}
    </div>
  );
};

const ViewAllPeople = () => {
  const groupData = useLoaderData() as Group;
  const toast = useToast();

  const [members, setMembers] = useState<User[]>([]);
  const [isLoading, setIsloading] = useState<boolean>(true);

  const adminIds: string[] = groupData.admins.map(
    (admin) => parseBasicUser(admin).id,
  );

  const removeMember = async (memberId: string) => {
    const removeRequest = async () => {
      try {
        const endpoint = `${URL_BASE}/groups/${groupData.id}/members/${memberId}`;
        const res = await fetch(endpoint, {
          method: 'DELETE',
          credentials: 'include',
        });

        if (res.ok) {
          setMembers((members) =>
            members.filter((member) => member.id !== memberId),
          );
        }
      } catch (error) {}
    };

    toast.showAsync(removeRequest, {
      loading: {
        title: 'Removing...',
      },
      success: (_) => ({
        title: 'Member removed successfully',
      }),
      error: (_) => ({
        title: 'Couldnt remove member, please try again',
      }),
    });
  };

  useEffect(() => {
    const fetchMembers = async () => {
      const endpoint = `${URL_BASE}/groups/${groupData.id}/members`;
      const res = await fetch(endpoint, {
        method: 'GET',
        credentials: 'include',
      });

      const data: any[] = await res.json();
      const membersData = data.map((user) => {
        return parseBasicUser(user);
      });
      setMembers(membersData);
      setIsloading(false);
    };

    fetchMembers();
  }, []);

  return (
    <div className="flex flex-col gap-4 justify-start items-center size-full">
      {isLoading && <Loading />}
      {!isLoading && (
        <>
          {members.length > 0 ? (
            <>
              {members.map((member) => {
                return (
                  <div
                    key={member.id}
                    className="block-container w-full items-center"
                  >
                    <AuthorPfp data={member} />
                    {adminIds.includes(member.id) && (
                      <p className="text-xl ml-auto font-bold">Moderator</p>
                    )}
                    {!adminIds.includes(member.id) && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          removeMember(member.id);
                        }}
                        className="flex ml-auto items-center justify-center font-semibold rounded-lg bg-danger hover:bg-secondary transition-colors text-foreground py-2 px-4"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                );
              })}
            </>
          ) : (
            <div className="flex justify-center items-center size-full">
              No members here
            </div>
          )}
        </>
      )}
    </div>
  );
};

const ViewRequests = () => {
  const data: string[] = ['Guria', 'Menege', 'Kaguya'];

  console.log(data.length);

  return (
    <div className="flex flex-col gap-4 justify-start items-center size-full">
      {data.length > 0 ? (
        <>
          {data.map((item, idx) => {
            return (
              <div key={idx} className="block-container w-full items-center">
                Request from @{item}
                <div className="flex gap-2 h-full ml-auto">
                  <button className="flex justify-center items-center gap-2 py-2 px-4 bg-success rounded-lg">
                    <Check />
                    Accept
                  </button>
                  <button className="flex justify-center items-center gap-2 py-2 px-4 bg-danger rounded-lg">
                    <Trash />
                    Deny
                  </button>
                </div>
              </div>
            );
          })}
        </>
      ) : (
        <div className="flex justify-center items-center size-full">
          No members here
        </div>
      )}
    </div>
  );
};

export default GroupRightSide;
