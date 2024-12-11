import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { RegistrationInputs } from "@/utils/customTypes";
import { registerUser } from "@/utils/apiCalls";

export default function RegistrationForm() {
  const [registrationErr, setRegistrationErr] = useState<string | null>(null);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationInputs>();

  const onSubmit: SubmitHandler<RegistrationInputs> = async (data) => {
    try {
      await registerUser(data);
      router.push("/verify-email");
    } catch (error: any) {
      if (
        error.response.data.msg === "Username already exists. Must be unique."
      ) {
        setRegistrationErr("Username already exists. This must be unique.");
      } else if (
        error.response.data.msg === "Email already exists. Must be unique."
      ) {
        setRegistrationErr(
          "That email address already exists in our system. Login with it and check your email."
        );
      } else {
        setRegistrationErr("Something went wrong. Please try again.");
        console.log(error.message);
      }
    }
  };

  return (
    <section className="max-w-sm">
      <h1 className="font-bold text-3xl">Register for Comm<span className="text-indigo-500">you</span>nity</h1>
      <p className="md:text-lg font-medium my-4">Give yourself a username and enter your email to sign up. You will then receive an email with a link to click to complete registration.</p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate={true}
        className="flex flex-col"
      >
        <input
          className="p-4 mb-4 rounded"
          placeholder="Username"
          {...register("username", {
            required: "Username is required",
            minLength: 4,
          })}
          name="username"
          id="username"
        />
        {errors.username && (
          <span className="mb-4 text-rose-600 text-xs font-bold">
            Username needs to be 4 characters or more
          </span>
        )}
        <input
          className="p-4 mb-4 rounded"
          placeholder="Email Address"
          {...register("user_email", {
            required: "Email is required",
            pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          })}
          name="user_email"
          id="user_email"
        />
        {errors.user_email && (
          <span className="mb-4 text-rose-600 text-xs font-bold">
            Email is required
          </span>
        )}
        
        <input
          className="w-max mx-auto cursor-pointer inline-flex items-center rounded-full px-9 py-3 text-xl font-semibold text-indigo-500 hover:text-white border-2 border-indigo-500 hover:bg-indigo-500 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-75 hover:bg-indigo-500 duration-300"
          type="submit"
        />
      </form>
      {registrationErr ? (
        <p className="font-bold mt-8 text-rose-600 text-center">
          {registrationErr}
        </p>
      ) : null}
    </section>
  );
}
