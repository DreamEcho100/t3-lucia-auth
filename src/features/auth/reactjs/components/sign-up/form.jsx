"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signUpAction } from "~/features/auth/nextjs/server/actions";
import { SignUpSchema } from "~/features/auth/base/server/libs/validators";

/**
 * @typedef {import("~/features/auth/base/server/features/sign-up/types").SignUpInput} FormValues
 */

export function SignUpForm() {
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(SignUpSchema),
    defaultValues: /** @type {FormValues} */ ({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    }),
  });

  /** @param {FormValues} values  */
  async function onSubmit(values) {
    const res = await signUpAction(values);
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
      toast(res.message ?? "Account created successfully");

      router.push("/");
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="example@test.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
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
                <Input placeholder="****" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm password</FormLabel>
              <FormControl>
                <Input placeholder="****" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
