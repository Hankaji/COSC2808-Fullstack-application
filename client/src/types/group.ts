export interface Group {
  name: string;
  description: string;
  visibility: GroupVisibility;
  groupImage?: string;
  coverImage?: string;
}

export enum GroupVisibility {
  PUBLIC,
  PRIVATE,
}

export const parseGroup = (data: any) => {
  return {
    name: data.name,
    description: data.description,
    visibility:
      GroupVisibility[
        (
          data.visibility as string
        ).toUpperCase() as keyof typeof GroupVisibility
      ],
    groupImage: data.virtualGroupImage,
    coverImage: data.virtualCoverImage,
  } as Group;
};
