import { trpc } from "../utils/trpc";

export const useGroups = () => {
  return trpc.groups.getGroups.useQuery();
};

export const useGroup = (id: string) => {
  return trpc.groups.getGroup.useQuery({ id });
};

export const useCreateGroup = () => {
  return trpc.groups.createGroup.useMutation();
};

export const useUpdateGroup = () => {
  return trpc.groups.updateGroup.useMutation();
};
