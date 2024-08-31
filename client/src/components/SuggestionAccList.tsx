import { FC, useCallback, useEffect, useMemo, useState } from "react";
import AccInfoWithAction from "./AccInfoWithAction";
import { Account } from "../types";
import { URL_BASE } from "../config";
import useAuth from "../hooks/useAuth";
import useToast from "../hooks/useToast";
import { convertFetchDataToAccount } from "../types/account";

const SuggestionsAccList: FC = () => {
  const { auth } = useAuth();
  const toast = useToast();

  const [suggestionList, setSuggestionList] = useState<Account[]>([]);
  const [requestReceiverList, setRequestReceiverList] = useState<string[]>([]);

  const fetchFriendSuggestions = useCallback(async () => {
    if (!auth.user) return;
    const endpoint = `${URL_BASE}/users/${auth.user.userId}/friends/recommend`;
    const res = await fetch(endpoint, {
      method: "GET",
      credentials: "include",
    });
    const result = await res.json();
    setSuggestionList(result.map((acc: any) => convertFetchDataToAccount(acc)));
  }, [auth.user]);

  const fetchRequestSentList = useCallback(async () => {
    if (!auth.user) return;
    const endpoint = `${URL_BASE}/users/${auth.user.userId}/friend-requests`;
    const res = await fetch(endpoint, {
      method: "GET",
      credentials: "include",
    });
    const result = await res.json();
    setRequestReceiverList(result.map((req: any) => req.receiver_id));
  }, [auth.user]);

  const handleSendFriendRequest = useCallback(
    async (user: Account) => {
      if (!auth.user) return;
      const sendFriendRequest = async () => {
        const endpoint = `${URL_BASE}/requests/friend_requests`;
        try {
          const res = await fetch(endpoint, {
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify({ receiver_id: user.id }),
          });
          if (res.ok) {
            await fetchRequestSentList();
          } else {
            throw Error("Failed to send friend request");
          }
        } catch (error: any) {
          console.error(error);
        }
      };

      toast.showAsync(sendFriendRequest, {
        loading: {
          title: "Loading...",
        },
        success: (_: any) => ({
          title: `Friend request sent to ${user.displayName}`,
        }),
        error: (_: any) => ({
          title: "Something wrong happened",
        }),
      });
    },
    [auth.user, fetchRequestSentList, toast]
  );

  const list = useMemo(
    () =>
      suggestionList.map((acc) => {
        const alreadySentRequest = requestReceiverList.includes(acc.id);
        const status = alreadySentRequest ? "requestSent" : "none";
        return (
          <AccInfoWithAction
            key={acc.id}
            data={acc}
            status={status}
            actionFn={
              alreadySentRequest
                ? undefined
                : () => handleSendFriendRequest(acc)
            }
          />
        );
      }),
    [requestReceiverList, handleSendFriendRequest, suggestionList]
  );

  useEffect(() => {
    fetchFriendSuggestions();
  }, [fetchFriendSuggestions]);

  useEffect(() => {
    fetchRequestSentList();
  }, [fetchRequestSentList]);

  return (
    <div className="border-2 border-border rounded-xl p-4">
      <h3 className="text-xl font-bold pb-3 border-b-2 border-border">
        Friend Suggestions
      </h3>
      <div className="h-[300px] overflow-y-auto space-y-4 py-4 pr-2">
        {list}
      </div>
    </div>
  );
};

export default SuggestionsAccList;
