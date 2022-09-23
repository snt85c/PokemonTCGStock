import { useUserAuth } from "./userAuth";
export default function Profile() {
  const { user, googleSignIn, logout } = useUserAuth();

  function Login() {
    return (
      <button
      className="px-2 rounded border-black border-2 bg-white m-2"
        onClick={() => {
          googleSignIn();
        }}
      >
        Login
      </button>
    );
  }

  function Logout() {
    return (
      <button
      className="px-2 rounded border-black border-2 bg-white m-2"
        onClick={() => {
          logout();
        }}
      >
        Logout
      </button>
    );
  }

  return (
    <section className="h-screen p-5 bg-slate-500">

    <div className=" flex flex-col justify-center items-center m-5">
      {user && <div>uid:{user.uid}</div>}
      {user && <div>name:{user.displayName}</div>}
      {!user && <Login />}
      {user && <Logout />}
    </div>
    </section>
  );
}
