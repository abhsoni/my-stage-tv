import { useState } from "react";

import { api } from "~/utils/api";
import { Genre } from "@prisma/client";

export default function CreateData() {
  const hello = api.post.hello.useQuery({ text: "from tRPC" });
  const [username,setUsername]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [userid,setUserid]=useState("");
  const [title,setTitle]=useState("");
  const [tvShowTitle,setTVShowTitle]=useState("");
  const [description,setDescription]=useState("");
  const [tvShowDescription,setTVShowDescription]=useState("");
  const [director,setDirector]=useState("");
  const [actors, setActors] = useState<string[]>([]);
  const [releaseDate, setReleaseDate] = useState(new Date());
  const [genres,setGenres]=useState([]);
  type episode = {
    episodeNumber: number
    seasonNumber: number
    releaseDate: Date
    director: string
    actors: string[]
  }
  const createUser = api.user.createUser.useMutation({
    onSuccess: () => {
      setUsername("");
    },
  });
  const createMovie = api.user.createMovie.useMutation({
    onSuccess: () => {
      setUsername("");
    },
  });
  const createTVShow = api.user.createTVShow.useMutation({
    onSuccess: () => {
      setUsername("");
    },
  });

  async function submitHandler(username:string,email:string,password:string){
    try{
        createUser.mutate({ username,email,password });
    }
    catch(error){
    console.log(error);
    } 
  }
  async function submitHandlerMovie(title:string,description:string,actors:string[],director:string,releaseDate:Date,genres:Genre[]){
    const genresSelected: ("Action" | "Comedy")[] = ["Action", "Comedy"];
    try{
      createMovie.mutate({ title,description,actors,director,releaseDate,genres:genresSelected });
    }
    catch(error){
    console.log(error);
    } 
  }
  const episodesCustom = [
    {
      releaseDate: new Date(),
      director: "Sanjay Leela Bhansali",
      actors: ["Ranveer Singh"],
      episodeNumber: 1,
      seasonNumber: 1
    },
    {
      releaseDate: new Date(),
      director: "Sanjay Leela Bhansali",
      actors: ["Ranveer Singh"],
      episodeNumber: 2,
      seasonNumber: 1
    },
    // Add more episodes as needed
  ];
  async function submitHandlerTVShow(title:string,description:string,genres:Genre[],episodes:episode[]){
    const genresSelected: ("Action" | "Comedy")[] = ["Action", "Comedy"];
    
    try{
      createTVShow.mutate({ title,description,genres:genresSelected,episodes:episodesCustom });
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
          Create <span className="text-[hsl(280,100%,70%)]">Sample Data</span> here.
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
            <div>
                <form
                    onSubmit={async (e) => {
                        e.preventDefault();
                        console.log("sdc");
                        await submitHandlerMovie(title,description,actors,director,releaseDate,genres); 
                    }}
                    className="flex flex-col gap-2 m-4"
                    >
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full rounded-full px-4 py-2 text-black"
                    />
                    <input
                        type="text"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full rounded-full px-4 py-2 text-black"
                    />
                    <input
                        type="date"
                        placeholder="Release Date"
                        value={releaseDate ? releaseDate.toISOString().split('T')[0] : ''}
                        onChange={(e) => setReleaseDate(new Date(e.target.value))}
                        className="w-full rounded-full px-4 py-2 text-black"
                    />
                    <input
                        type="text"
                        placeholder="Director"
                        value={director}
                        onChange={(e) => setDirector(e.target.value)}
                        className="w-full rounded-full px-4 py-2 text-black"
                    />
                    <input
                        type="text"
                        placeholder="Actors"
                        value={actors.join(', ')} // Join the array elements into a comma-separated string for display
                        onChange={(e) => setActors(e.target.value.split(',').map(actor => actor.trim()))} // Split the input value by comma and trim each actor
                        className="w-full rounded-full px-4 py-2 text-black"
                    />
                    <button
                        type="submit"
                        className="rounded-full bg-white/10 px-10 py-3 text-white font-semibold transition hover:bg-white/20"
                    >Create Movie
                    </button>
                </form>
            </div>
            <div>
                <form
                    onSubmit={async (e) => {
                        e.preventDefault();
                        console.log("sdc");
                        await submitHandlerTVShow(tvShowTitle,tvShowDescription,genres,episodesCustom); 
                    }}
                    className="flex flex-col gap-2 m-4"
                    >
                    <input
                        type="text"
                        placeholder="Title"
                        value={tvShowTitle}
                        onChange={(e) => setTVShowTitle(e.target.value)}
                        className="w-full rounded-full px-4 py-2 text-black"
                    />
                    <input
                        type="text"
                        placeholder="Description"
                        value={tvShowDescription}
                        onChange={(e) => setTVShowDescription(e.target.value)}
                        className="w-full rounded-full px-4 py-2 text-black"
                    />
                    {/* <input
                        type="text"
                        placeholder="Genres"
                        value={userid}
                        onChange={(e) => setUserid(e.target.value)}
                        className="w-full rounded-full px-4 py-2 text-black"
                    /> */}
                    <button
                        type="submit"
                        className="rounded-full bg-white/10 px-10 py-3 text-white font-semibold transition hover:bg-white/20"
                    >Create TVShow
                    </button>
                </form>
            </div>
          </div>
          <p className="text-2xl text-white">
            {hello.data ? hello.data.greeting : "Loading tRPC query..."}
          </p>
        </div>
      </main>
    </>
  );
}
