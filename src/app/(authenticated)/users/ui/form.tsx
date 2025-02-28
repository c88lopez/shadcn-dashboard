import React from "react";
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
import { getGraphQLClient, gqlCreateUser, gqlUpdateUser } from "@/lib/graphql";
import { useQueryClient } from "@tanstack/react-query";
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
import {
  UserCreateSchema,
  UserUpdateSchema,
} from "../../../../../../schemas/src";

type FormValues = {
  username: FormDataEntryValue | null;
  email: FormDataEntryValue | null;
  password: FormDataEntryValue | null;
};

export default function UserSheetForm({ ...props }) {
  const client = useQueryClient();

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
      await getGraphQLClient().mutate({
        mutation: gql,
        variables,
      });

      await client.invalidateQueries({ queryKey: ["users"] });

      toast.success(
        `User ${props?.user ? "updated" : "created"} successfully.`,
      );

      props.setOpen(false);
      form.reset();
    } catch (error) {
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
                      <Input placeholder="" {...field} />
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
