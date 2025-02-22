import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import React from "react";
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
import { gqlCreateUser, getGraphQLClient } from "@/lib/graphql";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { toast } from "sonner";

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

      const { data } = await getGraphQLClient().mutate({
        mutation: gqlCreateUser,
        variables: {
          createUserData: {
            username,
            email,
          },
        },
      });

      client.invalidateQueries({ queryKey: ["users"] });

      toast.success("User created successfully.");
      setSheetOpen(false);

      return data;
    },
  });

  const [sheetOpen, setSheetOpen] = React.useState(false);

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
          <form
            action={(formData) => {
              mutation.mutate(formData);
            }}
          >
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
