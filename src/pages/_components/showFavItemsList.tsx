"use client"
import { api } from "~/utils/api";
import { TRPCError } from "@trpc/server";
import { useEffect, useState } from "react";

export default function ShowFavItemList(){
    const userId=sessionStorage.getItem("userId") ?? "";
    const [rerender,setRerender] = useState(false);
    useEffect(()=>{
        fetchMyList.mutate({userId})
    },[rerender]);
    const fetchMyList = api.user.fetchMyList.useMutation({
        onSuccess: async ()=>{
            console.log("Favourite Items list fetched.");
        },
    });
    const removeFromMyFavList = api.user.removeFromUserFavList.useMutation({
        onSuccess: async () => {
            console.log("success");
            setRerender(!rerender);
        },
    });
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
    </>
);
}
