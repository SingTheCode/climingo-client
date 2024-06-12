import SignUpForm from "@/components/auth/SignUpForm";
import Avatar from "@/components/common/Avatar";

export default function SignUp() {
  return (
    <div className="w-full h-full flex flex-col items-center">
      <Avatar size="lg" src="/assets/green-boulder.svg" alt="green boulder" />
      <SignUpForm />
    </div>
  );
}
