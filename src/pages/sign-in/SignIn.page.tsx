import BgSignInAndSignUp from "@/pages/sign-in/components/BgSignInAndSignUp";
import logoImage from "@assets/images/logo.png";
import SignInForm from "@/pages/sign-in/components/SignInForm";

const SignInPage = () => (
  <div className="flex h-screen">
    <BgSignInAndSignUp message="VQS - Your task store management solution" />
    <div className="w-full md:w-1/2 p-8 overflow-y-auto content-center">
      <div className="flex justify-between">
        <img src={logoImage} alt="Logo" className="sm:hidden" width={120} />
      </div>
      <div className="px-4 md:px-0">
        <SignInForm />
      </div>
    </div>
  </div>
);

export default SignInPage;
