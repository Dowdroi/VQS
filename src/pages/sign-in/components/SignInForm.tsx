import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
// import googleIcon from '@assets/icons/google-icon.png';
import { useNavigate, useSearchParams } from "react-router-dom";
import Text from "@/components/ui/Text";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/Form";
import InputWithLabel from "@/components/forms/InputWithLabel";
import { Button } from "@/components/ui/Button";
// import OrDivider from '@components/common/OrDiver';
import { signInSchema } from "@/schemas/Auth.schema";
import * as auth from "aws-amplify/auth";
import PasswordChangeForm from "./NewPassword";
import { toast } from "sonner";

const SignInForm: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isNewPasswordRequired, setIsNewPasswordRequired] = useState(false);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const email = searchParams.get("email");
    if (email) {
      form.setValue("email", decodeURIComponent(email));
    }
  }, [searchParams, form]);

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    try {
      setIsLoading(true);
      const response = await auth.signIn({
        username: data.email,
        password: data.password,
        options: {
          clientMetadata: {
            email: data.email,
          },
        },
      });

      if (response.isSignedIn) {
        navigate("/");
      } else if (
        response.nextStep?.signInStep ===
        "CONFIRM_SIGN_IN_WITH_NEW_PASSWORD_REQUIRED"
      ) {
        setIsNewPasswordRequired(true);
        toast.info("Password Change Required", {
          description: "Please set a new password to continue",
        });
      }
    } catch (error) {
      toast.error("Sign In Failed", {
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // const handleSignInWithGoogle = async () => {
  //   setIsLoading(true);
  //   try {
  //     await auth.signInWithRedirect({
  //       provider: 'Google',
  //     });
  //     navigate('/');
  //   } catch (error) {
  //     toast({
  //       title: 'Sign In Failed',
  //       description:
  //         error instanceof Error ? error.message : 'An unknown error occurred',
  //       variant: 'destructive',
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handlePasswordChanged = () => {
    setIsNewPasswordRequired(false);
  };

  return (
    <div className="max-w-[428px] mx-auto">
      <Text asChild variant={"title-22-bold"}>
        <h2 className="mb-[35px] text-neutral-01">
          {isNewPasswordRequired ? "Change Password" : "Login"}
        </h2>
      </Text>

      {isNewPasswordRequired ? (
        <PasswordChangeForm onPasswordChanged={handlePasswordChanged} />
      ) : (
        <>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-[22px]"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <InputWithLabel
                        label="Email"
                        {...field}
                        type="email"
                        placeholder="Email"
                      />
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
                    <FormControl>
                      <InputWithLabel
                        label="Password"
                        {...field}
                        type="password"
                        placeholder="Password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                variant="default"
                className="w-full !mt-[35px]"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Continue"}
              </Button>
            </form>
          </Form>

          {/* <OrDivider />
          <div className="flex flex-col items-center gap-[22px] text-sm text-brand-01 font-bold mb-[35px]">
            <button
              className="w-full border border-[#D6D6D6] p-[4px_10px] rounded-[5px] flex items-center justify-center gap-[20px]"
              onClick={handleSignInWithGoogle}
              disabled={isLoading}
            >
              <img src={googleIcon} alt="Google" width={28} height={28} />
              Continue with Google
            </button>
          </div> */}
        </>
      )}
    </div>
  );
};

export default SignInForm;
