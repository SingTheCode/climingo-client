import Avatar from "@/components/common/Avatar";
import SignUpForm from "@/app/signUp/signUpForm";

export default function SignUp() {
  return (
    <div className="w-full h-full flex flex-col items-center">
      <Avatar size="lg" src="/assets/green-boulder.svg" alt="green boulder" />
      <SignUpForm />
    </div>
  );
}
