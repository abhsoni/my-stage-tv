import { useState } from "react";
import Link from "next/link";

import { api } from "~/utils/api";
import { Genre } from "@prisma/client";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const hello = api.post.hello.useQuery({ text: "in INDIA" });
  const [username,setUsername]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");

const router=useRouter();
  const createUser = api.user.createUser.useMutation();

  async function submitHandler(username:string,email:string,password:string){
    try{
        createUser.mutate({ username,email,password });
    }
    catch(error){
    console.log(error);
    } 
  }
  

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          Please <span className="text-[hsl(280,100%,70%)]">Signup</span> here.
          </h1>
          <div className="flex flex-row">
            <div>
                <form
                    onSubmit={async (e) => {
                        e.preventDefault();
                        console.log("sdc");
                        await submitHandler(username,email,password); 
                    }}
                    className="flex flex-col gap-2 m-4"
                    >
                    <input
                        type="text"
                        placeholder="User Name"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full rounded-full px-4 py-2 text-black"
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-full px-4 py-2 text-black"
                    />
                    <input
                        type="text"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-full px-4 py-2 text-black"
                    />
                    <button
                        type="submit"
                        className="rounded-full bg-white/10 px-10 py-3 text-white font-semibold transition hover:bg-white/20"
                    >Create User
                    </button>
                </form>
            </div>
          </div>
          <p className="text-2xl text-white">
            Already registered! Click here to <Link href="/login" className="text-[hsl(280,100%,70%)]">Login</Link> . 
          </p>
          <p className="text-2xl text-white">
            {hello.data ? hello.data.greeting : "Loading tRPC query..."}
          </p>
        </div>
      </main>
    </>
  );
}
