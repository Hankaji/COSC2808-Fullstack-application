import { ChevronDown, Globe, Lock, LucideIcon } from 'lucide-react';
import { type } from 'os';
import { title } from 'process';
import { FC, FormEvent, useRef, useState } from 'react';
import Divider from '../../../components/Divider';
import ImageUpload from '../../../components/ImageUpload';
import {
  DropDownItem,
  DropDownMenu,
  DropDownMenuContent,
} from '../../../components/ui/DropDownMenu';
import { Input } from '../../../components/ui/Input';
import { URL_BASE } from '../../../config';
import useToast from '../../../hooks/useToast';

const GroupFormPanel = () => {
  const [visibility, setVisibility] = useState<'Public' | 'Private'>('Public');

  const toast = useToast();

  const descriptionRef = useRef<HTMLDivElement>(null);

  const getVisibilityNode = (visibility: 'Public' | 'Private') => {
    if (visibility == 'Public') {
      return (
        <VisibilitySpan
          Icon={Globe}
          name="Public"
          des="Everyone can see your group"
        />
      );
    } else {
      return (
        <VisibilitySpan
          Icon={Lock}
          name="Private"
          des="Only approved members can see your group"
        />
      );
    }
  };

  const validateForm = (
    payload: Record<string, FormDataEntryValue>,
  ): boolean => {
    const errors: string[] = [];

    if (errors.length > 0) {
      return false;
    } else {
      return true;
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append('description', descriptionRef.current!.innerText);
    formData.append('visibility', visibility);
    const payload = Object.fromEntries(formData.entries());

    console.log(payload);

    validateForm(payload);

    const endpoint = `${URL_BASE}/requests/group_creation_requests`;
    const submit = async () => {
      try {
        // Send request
        const res = await fetch(endpoint, {
          credentials: 'include',
          method: 'POST',
          body: formData,
        });

        // Check request
        const data = await res.json();
        console.log(data);
        return data;
      } catch (error) {}
    };
    toast.showAsync(submit(), {
      loading: {
        title: 'Loading...',
      },
      success: (data) => ({
        title: `${data.message}`,
      }),
      error: (e) => ({
        title: `${e.message}`,
      }),
    });
  };

  return (
    <form
      encType="multipart/form-data"
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
    >
      <h1 className="text-3xl font-semibold">Create a group</h1>
      <Divider alignment="horizontal" />
      {/* Category */}
      <h2 className="flex flex-col text-xl font-semibold">
        Name
        <span className="text-sm text-muted font-normal">
          Group name should contain only alphabetical character and cannot be
          changed upon creation.
        </span>
      </h2>
      {/* Input form */}
      <div className="flex items-center justify-start gap-1 text-lg bg-background rounded-sm py-2 px-4 border-border border-2 border-solid focus-within:border-primary transition-colors">
        <span className="text-muted">g/</span>
        <Input
          name="name"
          className="p-0 focus:ring-0 focus:ring-offset-0 border-0 text-lg bg-transparent"
          placeholder="groupname"
        />
      </div>
      {/* Category */}
      <h2 className="flex flex-col text-xl font-semibold">
        Description
        <span className="text-sm text-muted font-normal">
          Tell people more about your group.
        </span>
      </h2>
      {/* Input form */}
      <div className="flex items-center max-h-[999px] transition-all duration-500 justify-start gap-1 text-lg bg-background rounded-sm py-2 px-4 border-border border-2 border-solid focus-within:border-primary">
        <div
          ref={descriptionRef}
          contentEditable
          className="w-full h-max p-0 text-wrap break-words break-all transition-all duration-500 resize-none bg-background text-lg rounded-lg outline-none"
        ></div>
      </div>
      {/* Category */}
      <h2 className="flex flex-col text-xl font-semibold">Visibility</h2>
      {/* Input form */}
      <div className="flex items-center justify-start gap-1 text-lg bg-background rounded-sm border-border border-2 border-solid focus-within:border-primary transition-colors">
        <DropDownMenu
          className="w-full group rounded-sm py-2 px-4"
          content={
            <DropDownMenuContent className="w-full">
              <DropDownItem
                onClick={() => {
                  setVisibility('Public');
                }}
              >
                {getVisibilityNode('Public')}
              </DropDownItem>
              <DropDownItem
                onClick={() => {
                  setVisibility('Private');
                }}
              >
                {getVisibilityNode('Private')}
              </DropDownItem>
            </DropDownMenuContent>
          }
        >
          <div className="justify-start">{getVisibilityNode(visibility)}</div>
          <ChevronDown className="ml-auto" />
        </DropDownMenu>
      </div>
      {/* Category */}
      <h2 className="flex flex-col text-xl font-semibold">
        Cover image
        <span className="text-sm text-muted font-normal">
          The cover image for your group when fully viewed.
        </span>
      </h2>
      {/* Input form */}
      <ImageUpload name="coverImage" className="rounded-sm py-2 px-4" />
      {/* Category */}
      <h2 className="flex flex-col text-xl font-semibold">
        Group avatar
        <span className="text-sm text-muted font-normal">
          The image people see when they search for your group.
        </span>
      </h2>
      {/* Input form */}
      <ImageUpload name="groupImage" className="rounded-sm py-2 px-4" />
      {/* Action */}
      <Divider alignment="horizontal" />
      <div className="flex items-center justify-end w-full">
        <button
          type="submit"
          className="rounded-lg font-bold py-2 px-4 bg-primary text-foreground hover:bg-secondary transition-colors"
        >
          Create group
        </button>
      </div>
    </form>
  );
};

const VisibilitySpan: FC<{ Icon: LucideIcon; name: string; des?: string }> = ({
  Icon,
  name,
  des,
}) => {
  return (
    <div className="group select-none">
      <span className="flex items-center justify-start gap-2 text-lg">
        <Icon size={20} />
        {name}
      </span>
      {des && (
        <p className="text-sm text-muted group-hover:text-white transition-colors">
          {des}
        </p>
      )}
    </div>
  );
};

export default GroupFormPanel;
