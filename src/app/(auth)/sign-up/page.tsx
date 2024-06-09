import { redirect } from "next/navigation";
import { validateRequest } from "~/features/auth/nextjs/server/validate-request";
import { SignUpForm } from "~/features/auth/reactjs/components/sign-up/form";

export default async function SignUpPage() {
  const { user } = await validateRequest();

  if (user) {
    return redirect("/");
  }

  return (
    <div className="flex flex-grow flex-col items-center justify-center p-8">
      <a
        href="#"
        className="mb-8 flex items-center justify-center text-2xl font-semibold dark:text-white lg:mb-10"
      >
        <img src="/favicon.ico" className="mr-4 h-11" />
      </a>
      <div className="w-full max-w-xl space-y-8 rounded-lg bg-white p-6 shadow dark:bg-gray-800 sm:p-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Create a Free Account
        </h2>
        <SignUpForm />
      </div>
    </div>
  );
}
