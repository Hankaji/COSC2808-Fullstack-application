import { Check, X } from "lucide-react";
import { FC } from "react";
import { Account } from "../../types";
import AccInfoWithIconButtons from "../../components/AccInfoWithIconButtons";

const list: Account[] = [
  {
    id: "alice_on_chain",
    username: "alice_on_chain",
    displayName: "Alice",
    imgUrl:
      "https://preview.redd.it/lhxag30v58d31.jpg?width=640&crop=smart&auto=webp&s=bcf582e90ffb150dfd3f905fbfbe44deb30e56e6",
  },
  {
    id: "its_bob",
    username: "its_bob",
    displayName: "Bob",
    imgUrl:
      "https://preview.redd.it/lhxag30v58d31.jpg?width=640&crop=smart&auto=webp&s=bcf582e90ffb150dfd3f905fbfbe44deb30e56e6",
  },
  {
    id: "charliexcx",
    username: "charliexcx",
    displayName: "Charlie",
    imgUrl:
      "https://preview.redd.it/lhxag30v58d31.jpg?width=640&crop=smart&auto=webp&s=bcf582e90ffb150dfd3f905fbfbe44deb30e56e6",
  },
];

const FriendRequestList: FC = () => {
  return (
    <div className="flex flex-col h-[calc(100vh-180px)]">
      <div className="flex-grow overflow-y-auto mt-2 pr-3">
        {list.map((acc) => (
          <AccInfoWithIconButtons
            key={acc.id}
            data={acc}
            buttons={[
              {
                type: "accept",
                onClick: () => {},
              },
              {
                type: "reject",
                onClick: () => {},
              },
            ]}
          />
        ))}
      </div>
    </div>
  );
};

export default FriendRequestList;
