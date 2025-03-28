import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="w-full h-full flex flex-col justify-between items-center gap-y-5">
      <div className="header">
        <h1 className="text-3xl">Smart City Dashboard</h1>
      </div>
      <SignIn />
    </div>
  );
}
