import React, { Dispatch } from "react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { gqlCreateUser, gqlUpdateUser } from "@/lib/api/queries/users";
import { ApolloError } from "@apollo/client";
import { useForm } from "react-hook-form";
import { z, ZodObject } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { UserCreateSchema, UserUpdateSchema } from "schemas";
import ApiClient from "@/lib/api/client";
import { redirect } from "next/navigation";

type FormValues = {
  username: FormDataEntryValue | null;
  email: FormDataEntryValue | null;
  password: FormDataEntryValue | null;
};

type UserSheetFormProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  apiClient: ApiClient;
  setRefresh: Dispatch<boolean>;
  user?: {
    cuid: string;
    username: string;
    email: string;
  };
};

export default function UserSheetForm({ ...props }: UserSheetFormProps) {
  const [serverError, setServerError] = React.useState<string | null>(null);

  let formSchema: ZodObject<any> = UserCreateSchema;
  if (props?.user) {
    formSchema = UserUpdateSchema;
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: props?.user?.username ?? "",
      email: props?.user?.email ?? "",
      password: "",
    },
    values: {
      username: props?.user?.username ?? "",
      email: props?.user?.email ?? "",
      password: "",
    },
  });

  const [submitting, setSubmitting] = React.useState(false);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setSubmitting(true);

    const username = values.username;
    const email = values.email;
    const password = values.password;

    let gql = gqlCreateUser;
    let variables: {
      cuid?: string;
      createUserData?: FormValues;
      updateUserData?: FormValues;
    } = {
      createUserData: {
        username,
        email,
        password,
      },
    };

    if (props?.user) {
      gql = gqlUpdateUser;
      variables = {
        cuid: props.user.cuid,
        updateUserData: {
          username,
          email,
          password,
        },
      };
    }

    try {
      props.apiClient
        .mutate({
          mutation: gql,
          variables,
        })
        .then(() => {
          props.setRefresh(true);

          toast.success(
            `User ${props?.user ? "updated" : "created"} successfully.`,
          );

          props.setOpen(false);
          form.reset();
        });
    } catch (error) {
      if (error.message === "Unauthorized") {
        redirect("/login");
      }

      if (error instanceof ApolloError) {
        setServerError(error.message);

        return {
          errors: {
            email: error.message,
          },
        };
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Sheet open={props.open} onOpenChange={props.setOpen}>
        <SheetContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <SheetHeader>
                <SheetTitle>Create user</SheetTitle>
                <SheetDescription>Create a new user.</SheetDescription>
              </SheetHeader>

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input placeholder="" {...field} type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <SheetFooter>
                <FormMessage className="">{serverError}</FormMessage>
                <div className="min-w-10"></div>
                <Button type="submit" disabled={submitting}>
                  {props?.user ? "Update" : "Create"}
                </Button>
              </SheetFooter>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    </>
  );
}
