import { SignOutButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

export default async function Page() {
  const user = await currentUser();

  if (!user) return <div>Not signed in</div>;

  return (
    <>
      <div>Hello {user?.emailAddresses[0].emailAddress}</div>
      <div><img src={user?.imageUrl} alt="" /></div>
      <div><SignOutButton /></div>
    </>
  );
}