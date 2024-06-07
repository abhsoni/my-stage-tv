import { useState } from "react";
import Link from "next/link";
import { api } from "~/utils/api";
import { Genre } from "@prisma/client";
import { useRouter } from "next/navigation";
interface InputData {
    email: string;
    password: string;
  }

export default function LoginPage() {
  const hello = api.post.hello.useQuery({ text: "in INDIA" });
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError,setLoginError]=useState("");
  const router=useRouter();
  const [inputData, setInputData] = useState<InputData>({
    email: '',
    password: '',
  });

  const loginUser = api.user.loginUser.useMutation({
    onSuccess: (data) => {
      sessionStorage.setItem("token",data.token);
      sessionStorage.setItem("userId",data.userId);
      router.push("/home-page");
    },
    onError: (error) => {
      if(error.data){
        const errorMsg = error.message;
        console.log(error.message);
        setLoginError(errorMsg);
      }
    }
  });

  async function loginHandler(email: string, password: string) {
    let valid = true;

    if (email.trim() === "") {
      setEmailError("Email is required.");
      valid = false;
    } else {
      setEmailError("");
    }

    if (password.trim() === "") {
      setPasswordError("Password is required.");
      valid = false;
    } else {
      setPasswordError("");
    }
    if (password.trim() !== "" && password.length<8) {
      setPasswordError(" Password should be at least 8 characters long.");
      valid = false;
    }

    if (valid) {
      try {
        loginUser.mutate({ email: email, password: password });
      } catch (error) {
        console.log(error);
      }
    }
  }
  

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          Please <span className="text-[hsl(280,100%,70%)]">Login</span> here.
          </h1>
          <div className="flex flex-row">
            <div>
                <form
                    onSubmit={async (e) => {
                        e.preventDefault();
                        console.log("sdc");
                        await loginHandler(email,password); 
                    }}
                    className="flex flex-col gap-2 m-4"
                    >
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-full px-4 py-2 text-black"
                    />
                    {emailError && (
                      <p className="text-red-500">{emailError}</p>
                    )}
                    <input
                        type="text"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-full px-4 py-2 text-black"
                    />
                    {passwordError && (
                      <p className="text-red-500">{passwordError}</p>
                    )}
                    <button
                        type="submit"
                        disabled={loginUser.isPending}
                        className="rounded-full bg-white/10 px-10 py-3 text-white font-semibold transition hover:bg-white/20"
                    >Login
                    </button>
                </form>
            </div>
          </div>
          {loginUser.error && (
                <p className="text-red-500 mt-2">Error: {loginError}</p>
              )}
          <p className="text-2xl text-white">
            Already registered! Click here to <Link href="/signup" className="text-[hsl(280,100%,70%)]">Signup</Link> . 
          </p>
          <p className="text-2xl text-white">
            {hello.data ? hello.data.greeting : "Loading tRPC query..."}
          </p>
        </div>
      </main>
    </>
  );
}
