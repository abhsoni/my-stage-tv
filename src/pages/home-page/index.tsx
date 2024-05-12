import Head from "next/head";
import Link from "next/link";
import { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { api } from "~/utils/api";
import { Genre } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export default function HomePage() {
  const hello = api.post.hello.useQuery({ text: "from tRPC" });
  const router = useRouter();
  const fetchMovies = api.user.fetchAllMovies.useQuery();
  const fetchTVShows = api.user.fetchAllTVShows.useQuery();
  const userIDTesting="663f8a5d7a1c5225792f114f";
  const fetchMyList = api.user.fetchMyList.useQuery({userId:userIDTesting});
  const [selectedMovies, setSelectedMovies] = useState<string[]>([]);
  const [selectedTVShows, setSelectedTVShows] = useState<string[]>([]);
  const handleMovieSelection = (event: ChangeEvent<HTMLInputElement>, movieId: string) => {
    if (event.target.checked) {
      setSelectedMovies((prevSelectedMovies) => [...prevSelectedMovies, movieId]);
    } else {
      setSelectedMovies((prevSelectedMovies) => prevSelectedMovies.filter((id) => id !== movieId));
    }
  };
  const handleTVShowSelection = (event: ChangeEvent<HTMLInputElement>, tvShowId: string) => {
    if (event.target.checked) {
      setSelectedTVShows((prevSelectedTVShows) => [...prevSelectedTVShows, tvShowId]);
    } else {
      setSelectedTVShows((prevSelectedTVShows) => prevSelectedTVShows.filter((id) => id !== tvShowId));
    }
  };
  const addToFavList = api.user.addToUserFavList.useMutation({
    onSuccess: async () => {
      console.log("success");
    },
  });
  const removeFromMyFavList = api.user.removeFromUserFavList.useMutation({
    onSuccess: async () => {
      console.log("success");
    },
  });
  const checkHandler = (e:ChangeEvent<HTMLInputElement>,itemId:string,itemType:string)=>{
    
    console.log(itemId);
    if(userIDTesting){
        addToFavList.mutate({userId:userIDTesting,itemId,itemType});
    }
  }
  const removeFromMyList = async (userId:string,itemId:string,itemType:string) => {
    try {
      // Call the API to remove the item from the list
      removeFromMyFavList.mutate({ userId, itemId, itemType });
      
      // Update the local state to reflect the removal
    } catch (error) {
      console.error("Error removing item from list:", error);
      // Handle the error, e.g., display an error message to the user
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to remove item from list" });
    }
  };

  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-4xl font-extrabold tracking-tight text-white">
          Sit back and <span className="text-[hsl(280,100%,70%)]">enjoy your movies</span> here.
          </h1>
          <div className="flex flex-row">
            <div className="flex flex-col items-start gap-4 mx-8">
                <h2 className="text-3xl text-white">Movies</h2>
                {fetchMovies.data ? (
                fetchMovies.data.map((movie) => (
                    <div key={movie.id} className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id={`movie-${movie.id}`}
                        // checked={selectedMovies.includes(movie.id)}
                        onChange={(event) => checkHandler(event, movie.id,"Movie")}
                    />
                    <label htmlFor={`movie-${movie.id}`} className="text-white">{movie.title}</label>
                    </div>
                ))
                ) : (
                <p className="text-white">Loading movies...</p>
                )}
            </div> 
            <div className="flex flex-col items-start gap-4 mx-8">
                <h2 className="text-3xl text-white">TV Shows</h2>
                {fetchTVShows.data ? (
                fetchTVShows.data.map((tvShow) => (
                    <div key={tvShow.id} className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id={`tvShow-${tvShow.id}`}
                        checked={selectedTVShows.includes(tvShow.id)}
                        onChange={(event) => checkHandler(event, tvShow.id,"TVShow")}
                    />
                    <label htmlFor={`tvShow-${tvShow.id}`} className="text-white">{tvShow.title}</label>
                    </div>
                ))
                ) : (
                <p className="text-white">Loading TV shows...</p>
                )}
            </div>
            <div className="flex flex-col items-start gap-4 mx-8">
                <h2 className="text-3xl text-white">My Favourite Movie List</h2>
                {fetchMyList.data ? (
                fetchMyList.data.favMovieList.map((item) => (
                    <div key={item.id} className="flex items-center gap-2">
                    <label htmlFor={`tvShow-${item.id}`} className="text-white">{item.title}</label>
                    <div key={item.id} className="flex items-center text-white text-2xl gap-2">
                        <button onClick={(e) => removeFromMyList(userIDTesting,item.id,"Movie")}>-</button>
                    </div>
                    </div>
                ))
                ) : (
                <p className="text-white">Loading TV shows...</p>
                )}
            </div>
            <div className="flex flex-col items-start gap-4 mx-8">
                <h2 className="text-3xl text-white">My Favourite TVShow List</h2>
                {fetchMyList.data ? (
                fetchMyList.data.favTVShowList.map((item) => (
                    <div key={item.id} className="flex items-center gap-2">
                    <label htmlFor={`tvShow-${item.id}`} className="text-white">{item.title}</label>
                    <div key={item.id} className="flex items-center text-white text-2xl gap-2">
                        <button onClick={(e) => removeFromMyList(userIDTesting,item.id,"TVShow")}>-</button>
                    </div>
                    </div>
                ))
                ) : (
                <p className="text-white">Loading TV shows...</p>
                )}
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
