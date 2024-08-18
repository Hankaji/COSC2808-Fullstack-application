import { useParams } from 'react-router';
import PostCreationPanel from '../../../components/PostCreationPanel';

const GroupPanel = () => {
  const params = useParams();
  const groupId = params.groupId;

  console.log(groupId);

  return (
    <div>
      {groupId}
      <PostCreationPanel />
    </div>
  );
};

export default GroupPanel;
