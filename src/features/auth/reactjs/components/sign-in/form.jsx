"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signInAction } from "~/features/auth/nextjs/server/actions";
import { SignInSchema } from "~/features/auth/base/server/libs/validators";
import { useState } from "react";

/**
 * @typedef {import("~/features/auth/base/server/features/sign-in/types").SignInInput} FormValues
 */

/**
 * @param {{ form: import("react-hook-form").UseFormReturn<FormValues> }} props
 */
function UsernameOrEmailField({ form }) {
  const [isEmail, setIsEmail] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <FormField
        control={form.control}
        name={isEmail ? "email" : "name"}
        render={({ field }) => (
          <FormItem>
            <div className="flex justify-between gap-2">
              <FormLabel className="grid place-items-center">
                {isEmail ? "Email" : "Username"}
              </FormLabel>

              <Button
                type="button"
                variant="link"
                className="h-fit p-0"
                onClick={() => {
                  setIsEmail((prev) => !prev);
                  form.setValue(isEmail ? "name" : "email", "");
                  form.setValue(!isEmail ? "email" : "name", undefined);
                }}
              >
                {isEmail ? "Use Username" : "Use Email"}
              </Button>
            </div>
            <FormControl>
              <Input
                placeholder={isEmail ? "example@test.com" : "john_doe"}
                {...field}
              />
            </FormControl>
            <FormMessage />
            <FormDescription>
              {isEmail ? "Enter your email address" : "Enter your username"}
            </FormDescription>
          </FormItem>
        )}
      />
    </div>
  );
}

export function SignInForm() {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(SignInSchema),
    defaultValues: /** @type {FormValues} */ ({
      name: "",
      email: undefined,
      password: "",
    }),
  });

  /** @param {FormValues} values  */
  async function onSubmit(values) {
    const res = await signInAction(values);
    if (res.status === "error") {
      toast.error(res.message);
    } else if (res.status === "input-validation-errors") {
      for (const field in res.fields) {
        const message = res.fields[field]?.join("\n");

        if (message) {
          form.setError(/** @type {keyof FormValues} */ (field), { message });
        }
      }
    } else if (res.status === "success") {
      toast(res.message ?? "Signed in successfully");

      router.push("/");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="dark:text-whiite space-y-2"
      >
        <UsernameOrEmailField form={form} />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="****" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="justify-end">
          Submit
        </Button>
      </form>
    </Form>
  );
}
