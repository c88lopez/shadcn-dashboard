import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import React, { useActionState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { createUser, getGraphQLClient } from "@/lib/graphql";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";

export type State = {
  errors?: {
    email?: string[];
    username?: string[];
  };
  message?: string | null;
};

export default function UserCreate() {
  const client = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const username = formData.get("username");
      const email = formData.get("email");

      console.log({ username, email });

      const { data } = await getGraphQLClient().mutate({
        mutation: createUser,
        variables: {
          createUserData: {
            username,
            email,
          },
        },
      });

      client.invalidateQueries({ queryKey: ["users"] });
      setSheetOpen(false);

      return data;
    },
  });

  const createUserAction = async (prevState: State, formData: FormData) => {
    mutation.mutate(formData);
  };

  const initialState: State = { message: null, errors: {} };

  const [sheetOpen, setSheetOpen] = React.useState(false);

  const [state, formAction] = useActionState(createUserAction, initialState);

  return (
    <>
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetTrigger asChild>
          <Button variant="default">
            Create
            <Plus />
          </Button>
        </SheetTrigger>

        <SheetContent>
          <form action={formAction}>
            <SheetHeader>
              <SheetTitle>Create user</SheetTitle>
              <SheetDescription>Create a new user.</SheetDescription>
            </SheetHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Username
                </Label>
                <Input
                  required={true}
                  id="username"
                  name="username"
                  defaultValue=""
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  required={true}
                  id="email"
                  name="email"
                  defaultValue=""
                  className="col-span-3"
                />
              </div>
            </div>

            <SheetFooter>
              <Button type="submit">Create</Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
}
