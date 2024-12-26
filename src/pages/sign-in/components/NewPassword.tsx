import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/Form";
import InputWithLabel from "@/components/forms/InputWithLabel";
import { Button } from "@/components/ui/Button";
import { passwordSchema } from "@/schemas/Auth.schema";
import * as auth from "aws-amplify/auth";
import { toast } from "sonner";

const PasswordChangeForm = ({
  onPasswordChanged,
}: {
  onPasswordChanged: () => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  });

  const watchPassword = form.watch("password");
  const watchConfirmPassword = form.watch("confirmPassword");

  const onSubmit = async (data: z.infer<typeof passwordSchema>) => {
    console.log("Password form submitted:", data);

    if (!data.password || data.password !== data.confirmPassword) {
      toast.error("Validation Error", {
        description:
          "Please check your passwords match and meet all requirements",
      });
      return;
    }

    try {
      setIsLoading(true);

      const response = await auth.confirmSignIn({
        challengeResponse: data.password,
      });

      if (response.isSignedIn) {
        toast.success("Success", {
          description: "Password changed successfully",
        });
        onPasswordChanged?.();
        navigate("/");
      }
    } catch (error) {
      console.error("Password change error:", error);
      toast.error("Password Change Failed", {
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-[22px]">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputWithLabel
                  label="New Password"
                  {...field}
                  type="password"
                  placeholder="Enter new password"
                />
              </FormControl>
              <FormMessage />
              <div className="text-sm text-gray-500 mt-2">
                Password must:
                <ul className="list-disc pl-5">
                  <li
                    className={
                      watchPassword?.length >= 8 ? "text-green-500" : ""
                    }
                  >
                    Be at least 8 characters long
                  </li>
                  <li
                    className={
                      /[A-Z]/.test(watchPassword || "") ? "text-green-500" : ""
                    }
                  >
                    Contain at least one uppercase letter
                  </li>
                  <li
                    className={
                      /[a-z]/.test(watchPassword || "") ? "text-green-500" : ""
                    }
                  >
                    Contain at least one lowercase letter
                  </li>
                  <li
                    className={
                      /[0-9]/.test(watchPassword || "") ? "text-green-500" : ""
                    }
                  >
                    Contain at least one number
                  </li>
                  <li
                    className={
                      /[^A-Za-z0-9]/.test(watchPassword || "")
                        ? "text-green-500"
                        : ""
                    }
                  >
                    Contain at least one special character
                  </li>
                </ul>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <InputWithLabel
                  label="Confirm Password"
                  {...field}
                  type="password"
                  placeholder="Confirm new password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="h-4">
          {watchPassword &&
            watchConfirmPassword &&
            watchPassword !== watchConfirmPassword && (
              <p className="text-red-500 text-sm">Passwords do not match</p>
            )}
        </div>
        <Button
          type="submit"
          variant="default"
          className="w-full !mt-[35px]"
          disabled={isLoading || !form.formState.isValid}
        >
          {isLoading ? "Changing Password..." : "Change Password"}
        </Button>
      </form>
    </Form>
  );
};

export default PasswordChangeForm;
