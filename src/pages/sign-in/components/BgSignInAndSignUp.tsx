import logoImage from "@assets/images/logo.png";

interface BgSignInAndSignUpProps {
  maxWidth?: string;
  message: string;
}

const BgSignInAndSignUp: React.FC<BgSignInAndSignUpProps> = ({
  maxWidth = "428px",
  message,
}) => (
  <div className="hidden relative md:w-1/2 bg-[#000038] p-8 md:flex flex-row justify-center items-center">
    <div className="">
      <img
        src={logoImage}
        alt="Logo"
        className="mb-[26px]"
        width={167}
        height={26}
      />
      <h2
        className="text-white text-[32px] font-bold leading-[46px] capitalize"
        style={{ maxWidth }}
      >
        {message}
      </h2>
    </div>
  </div>
);

export default BgSignInAndSignUp;
