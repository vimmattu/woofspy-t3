import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Spacer,
  Switch,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FormEvent, useState } from "react";
import { z } from "zod";
import type { CreateGroupInput } from "../../server/trpc/schema/group.schema";

interface Props {
  defaultName?: string;
  defaultEmails?: string[];
  defaultSelected?: boolean;
  isEdit?: boolean;
  onSubmit: (input: CreateGroupInput) => void;
  isSubmitting?: boolean;
}

const validateEmail = z.string().email();

export const GroupForm: React.FC<Props> = ({
  defaultName = "",
  defaultEmails = [],
  defaultSelected = false,
  isEdit,
  onSubmit,
  isSubmitting,
}) => {
  const [name, setName] = useState<string>(defaultName);
  const [emails, setEmails] = useState<string[]>(defaultEmails);
  const [selected, setSelected] = useState<boolean>(defaultSelected);

  const [newEmail, setNewEmail] = useState<string>("");
  const [newEmailError, setNewEmailError] = useState<string>("");

  const handleSubmit = (e: FormEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    onSubmit({ name, emails, selectedByDefault: selected });
  };

  const handleAddUser = () => {
    if (emails.includes(newEmail))
      return setNewEmailError("Email is already added");
    try {
      setNewEmailError("");
      validateEmail.parse(newEmail);
      setEmails([...emails, newEmail]);
      setNewEmail("");
    } catch (e) {
      setNewEmailError("Invalid email");
    }
  };
  const handleRemoveUser = (email: string) => {
    setEmails(emails.filter((e) => e !== email));
  };

  return (
    <VStack as="form" w="full" spacing={2} onSubmit={handleSubmit}>
      <FormControl>
        <FormLabel fontWeight="bold">Group name</FormLabel>
        <Input
          required
          placeholder="Group name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>

      <FormControl display="flex" alignItems="center">
        <FormLabel mb={0} fontWeight="bold">
          Selected by default
        </FormLabel>
        <Switch isChecked={selected} onChange={() => setSelected(!selected)} />
      </FormControl>

      <FormControl>
        <FormLabel fontWeight="bold">Users</FormLabel>
        <VStack w="full">
          {!isEdit && (
            <HStack w="full">
              <Text>You</Text>
              <Spacer />
              <Text>Admin</Text>
            </HStack>
          )}
          {emails.map((email) => (
            <HStack w="full" key={email}>
              <Text>{email}</Text>
              <Spacer />
              <Button
                variant="outline"
                colorScheme="red"
                onClick={() => handleRemoveUser(email)}
              >
                Remove
              </Button>
            </HStack>
          ))}
        </VStack>
      </FormControl>

      <FormControl isInvalid={!!newEmailError}>
        <FormLabel fontWeight="bold">Add user</FormLabel>
        <HStack>
          <Input
            type="email"
            placeholder="user@example.com"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <Button variant="outline" colorScheme="green" onClick={handleAddUser}>
            Add user
          </Button>
        </HStack>
        <FormErrorMessage>{newEmailError}</FormErrorMessage>
      </FormControl>

      <HStack w="full">
        <Button disabled={isSubmitting} type="submit" colorScheme="green">
          {isEdit ? "Save" : "Create"}
        </Button>
        {isEdit && (
          <Button disabled={isSubmitting} colorScheme="red" variant="outline">
            Delete
          </Button>
        )}
      </HStack>
    </VStack>
  );
};
