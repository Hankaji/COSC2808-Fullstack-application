import { User, Users, SquarePen } from 'lucide-react';
import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Notification, NotificationType } from '../../types';
import { formatRelativeTime } from '../../utils';

// generate a list of 5 Notification objects
const list: Notification[] = [
  {
    id: '1',
    type: NotificationType.FRIEND_REQUEST,
    message: 'Alice sent you a friend request',
    createdAt: new Date('2024-08-18T12:00:00Z'),
    isRead: true,
  },
  {
    id: '2',
    type: NotificationType.FRIEND_REQUEST_ACCEPTED,
    message: 'Bob accepted your friend request',
    createdAt: new Date('2024-08-19T00:00:00Z'),
    isRead: false,
  },
  {
    id: '3',
    type: NotificationType.POST_COMMENT,
    message: 'Charlie commented on your post',
    createdAt: new Date('2024-08-18T00:00:00Z'),
    isRead: true,
  },
  {
    id: '4',
    type: NotificationType.POST_REACTION,
    message: 'David reacted to your post',
    createdAt: new Date('2024-08-17T12:00:00Z'),
    isRead: true,
  },
  {
    id: '5',
    type: NotificationType.GROUP_CREATION_APPROVAL,
    message: 'Eve approved your group creation request',
    createdAt: new Date('2024-08-19T12:00:00Z'),
    isRead: false,
  },
  {
    id: '6',
    type: NotificationType.GROUP_MEMBER_REQUEST_APPROVAL,
    message: 'Frank approved your group member request',
    createdAt: new Date('2024-08-17T00:00:00Z'),
    isRead: true,
  },
];

const NotificationList: FC = () => {
  // TODO: Mark all notifications as read when the component mounts

  const sortedList = [...list, ...list, ...list].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
  );

  return (
    <div className="">
      <h2 className="font-bold text-3xl pb-3 border-b-2 border-border">
        Notifications
      </h2>
      <div className="">
        {sortedList.map((item) => (
          <NotificationItem
            key={item.id}
            data={item}
            href={getHrefFromNotificationType(item.type)}
            onRead={() => {}}
          />
        ))}
      </div>
    </div>
  );
};

export default NotificationList;

interface NotificationItemProps {
  data: Notification;
  href: string;
  onRead: () => void;
}

const NotificationItem: FC<NotificationItemProps> = ({
  data: { message, isRead, type, createdAt },
  href,
}) => {
  const Icon = (() => {
    switch (type) {
      case NotificationType.FRIEND_REQUEST:
      case NotificationType.FRIEND_REQUEST_ACCEPTED:
        return User;
      case NotificationType.POST_COMMENT:
      case NotificationType.POST_REACTION:
        return SquarePen;
      case NotificationType.GROUP_CREATION_APPROVAL:
      case NotificationType.GROUP_MEMBER_REQUEST_APPROVAL:
        return Users;
    }
  })();

  const iconClassName = (() => {
    switch (type) {
      case NotificationType.FRIEND_REQUEST:
      case NotificationType.FRIEND_REQUEST_ACCEPTED:
        return 'stroke-blue-300';
      case NotificationType.POST_COMMENT:
      case NotificationType.POST_REACTION:
        return 'stroke-green-300';
      case NotificationType.GROUP_CREATION_APPROVAL:
      case NotificationType.GROUP_MEMBER_REQUEST_APPROVAL:
        return 'stroke-yellow-300';
    }
  })();

  return (
    <Link
      to={href}
      className="px-2 flex items-center justify-between gap-4 border-b-2 border-border py-4 hover:bg-slate-900"
    >
      <div className="flex items-center gap-4">
        <Icon size={28} className={iconClassName} />
        <p className="line-clamp-2">
          {message}
          <span className="text-slate-400 text-sm ml-2">
            {formatRelativeTime(createdAt)}
          </span>
        </p>
      </div>
      {!isRead && (
        <span className="relative flex size-2 mr-2">
          <span className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full size-2 bg-red-400"></span>
        </span>
      )}
    </Link>
  );
};

function getHrefFromNotificationType(
  notificationType: NotificationType,
): string {
  switch (notificationType) {
    case NotificationType.FRIEND_REQUEST:
    case NotificationType.FRIEND_REQUEST_ACCEPTED:
      return '/friends';
    case NotificationType.POST_COMMENT:
    case NotificationType.POST_REACTION:
      return '/'; // TODO: change this to the actual post page
    case NotificationType.GROUP_CREATION_APPROVAL:
    case NotificationType.GROUP_MEMBER_REQUEST_APPROVAL:
      return '/'; // TODO: change this to the actual group page
  }
}
