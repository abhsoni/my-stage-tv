import { ChangeEvent, useEffect, useState, useRef } from "react";

import { api } from "~/utils/api";
import { TRPCError } from "@trpc/server";
import { useRouter } from "next/navigation";
import PageWithAuth from "~/hocs/authHoc";

function HomePage() {
  const hello = api.post.hello.useQuery({ text: "from tRPC" });
  const fetchMovies = api.user.fetchAllMovies.useQuery();
  const fetchTVShows = api.user.fetchAllTVShows.useQuery();
  const router=useRouter();

  const [userId, setUserId] =useState("");
  // let userId:string;
  useEffect(()=>{
    // userId=sessionStorage.getItem("userId") ?? "";
    setUserId(sessionStorage.getItem("userId") ?? "");
    fetchMyList.mutate({userId:sessionStorage.getItem("userId") ?? ""});
  },[]);
  const fetchMyList = api.user.fetchMyList.useMutation({
    onSuccess: async ()=>{
        console.log("Favourite Items list fetched.");
    },
  });
  const addToFavList = api.user.addToUserFavList.useMutation({
    onSuccess: async () => {
      console.log("success");
      router.refresh();
    },
  });
  const removeFromMyFavList = api.user.removeFromUserFavList.useMutation({
    onSuccess: async () => {
      console.log("success");
      router.refresh();
    },
  });
  const checkHandler = (itemId:string,itemType:string)=>{
    
    console.log(itemId);
    console.log(userId);
    if(userId){
        addToFavList.mutate({userId:userId,itemId,itemType});
    }
  }
  const logoutHandler = ()=>{
    
    sessionStorage.clear();
    router.push("/login");
  }
  const removeFromMyList = async (userId:string,itemId:string,itemType:string) => {
    try {
      // Call the API to remove the item from the list
      removeFromMyFavList.mutate({ userId, itemId, itemType });
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
                    {/* <input
                        type="checkbox"
                        id={`movie-${movie.id}`}
                        // checked={selectedMovies.includes(movie.id)}
                        onChange={(event) => checkHandler( movie.id,"Movie")}
                    /> */}
                    <button onClick={(event) => checkHandler( movie.id,"Movie")} className="text-white font-extrabold">+</button>
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
                    {/* <input
                        type="checkbox"
                        id={`tvShow-${tvShow.id}`}
                        // checked={selectedTVShows.includes(tvShow.id)}
                        onChange={(event) => checkHandler(tvShow.id,"TVShow")}
                    /> */}
                    <button onClick={(event) => checkHandler(tvShow.id,"TVShow")} className="text-white font-extrabold">+</button>
                    <label htmlFor={`tvShow-${tvShow.id}`} className="text-white">{tvShow.title}</label>
                    </div>
                ))
                ) : (
                <p className="text-white">Loading TV shows...</p>
                )}
            </div>
            {/* <ShowFavItemList userId={userId}/> */}
            <div className="flex flex-col items-start gap-4 mx-8">
                <h2 className="text-3xl text-white">My Favourite Movie List</h2>
                {fetchMyList.data ? (
                fetchMyList.data.favMovieList.map((item) => (
                    <div key={item.id} className="flex items-center gap-2">
                    <label htmlFor={`tvShow-${item.id}`} className="text-white">{item.title}</label>
                    <div key={item.id} className="flex items-center text-[#ef4444] text-2xl gap-2">
                        <button onClick={(e) => removeFromMyList(userId,item.id,"Movie")}>-</button>
                    </div>
                    </div>
                ))
                ) : (
                <p className="text-white">Loading Movies...</p>
                )}
            </div>
            <div className="flex flex-col items-start gap-4 mx-8">
                <h2 className="text-3xl text-white">My Favourite TVShow List</h2>
                {fetchMyList.data ? (
                fetchMyList.data.favTVShowList.map((item) => (
                    <div key={item.id} className="flex items-center gap-2">
                    <label htmlFor={`tvShow-${item.id}`} className="text-white">{item.title}</label>
                    <div key={item.id} className="flex items-center text-[#ef4444] text-2xl gap-2">
                        <button onClick={(e) => removeFromMyList(userId,item.id,"TVShow")}>-</button>
                    </div>
                    </div>
                ))
                ) : (
                <p className="text-white">Loading TV shows...</p>
                )}
            </div>
          </div>
          <p className="text-2xl text-white">
            Click here to <button onClick={logoutHandler} className="text-[hsl(280,100%,70%)]">Logout</button> . 
          </p>
          <p className="text-2xl text-white">
            {hello.data ? hello.data.greeting : "Loading tRPC query..."}
          </p>
        </div>
      </main>
    </>
  );
}
export default PageWithAuth(HomePage);