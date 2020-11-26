import Router from "next/router";

export default function Home() {
  return (
    <div>
      <button
        onClick={() => {
          Router.push("/login");
        }}
      >
        Login
      </button>
    </div>
  );
}
