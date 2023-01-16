import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { trpc } from "../utils/trpc";

export const useGroups = () => {
  return trpc.groups.getGroups.useQuery();
};

export const useGroup = (id: string) => {
  return trpc.groups.getGroup.useQuery({ id });
};

export const useCreateGroup = () => {
  const toast = useToast();
  const router = useRouter();
  return trpc.groups.createGroup.useMutation({
    onSuccess: () => {
      router.push("/settings/");
      toast({
        title: "Group created",
        description: "Invitations have been sent to new group users",
        status: "success",
        isClosable: true,
      });
    },
    onError: (err) => {
      toast({
        title: "Error creating group",
        description: err.message,
        status: "error",
        isClosable: true,
      });
    },
  });
};

export const useUpdateGroup = () => {
  const toast = useToast();
  const router = useRouter();
  return trpc.groups.updateGroup.useMutation({
    onSuccess: () => {
      router.push("/settings/");
      toast({
        title: "Group updated",
        description: "Invitations have been sent to new group users",
        status: "success",
        isClosable: true,
      });
    },
    onError: (err) => {
      toast({
        title: "Error updating group",
        description: err.message,
        status: "error",
        isClosable: true,
      });
    },
  });
};
