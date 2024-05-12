import { z } from "zod";
import { TRPCError } from '@trpc/server';
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { Genre } from "@prisma/client";

export const userRouter = createTRPCRouter({
  helloFromAuth: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  createUser: publicProcedure
    .input(z.object({ username: z.string().min(1)}))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
    //   const cat:Category[]=[{id:60,categoryName:"Shoes- JORDAN",createdAt:new Date(),updatedAt:new Date()}];
    //   await new Promise((resolve) => setTimeout(resolve, 1000));
      return ctx.db.user.create({
        data: {
          username:input.username,
          preferences:{
            favoriteGenres:[],
            dislikedGenres:[]
          },
        },
      });
    }),
    createMovie: publicProcedure
    .input(z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      genres: z.array(z.nativeEnum(Genre)), // Define genres as an array of Genre enum values
      releaseDate: z.date(),
      director: z.string().min(1),
      actors: z.array(z.string().min(1)) // Define actors as an array of strings
    }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.movie.create({
        data: {
          title: input.title,
          description: input.description,
          genres: input.genres,
          releaseDate: input.releaseDate,
          director: input.director,
          actors: input.actors
        }
      });
    }),

  createTVShow: publicProcedure
    .input(z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      genres: z.array(z.nativeEnum(Genre)), // Define genres as an array of Genre enum values
      episodes: z.array(z.object({
        episodeNumber: z.number().int(),
        seasonNumber: z.number().int(),
        releaseDate: z.date(),
        director: z.string().min(1),
        actors: z.array(z.string().min(1)) // Define actors as an array of strings
      }))
    }))
    .mutation(async ({ ctx, input }) => {
      const episodes = [
        {
          releaseDate: new Date(),
          director: "Sanjay Leela Bhansali",
          actors: "Ranveer Singh",
          episodeNumber: 1,
          seasonNumber: 1
        },
        {
          releaseDate: new Date(),
          director: "Sanjay Leela Bhansali",
          actors: "Ranveer Singh",
          episodeNumber: 2,
          seasonNumber: 1
        },
        // Add more episodes as needed
      ];
      return ctx.db.tVShow.create({
        data: {
          title: input.title,
          description: input.description,
          genres: input.genres,
          episodes: input.episodes
        }
      });
    }),
  
  addToUserFavList: publicProcedure
    .input(z.object({ userId: z.string(), itemId: z.string(), itemType: z.string() }))
    .mutation(async ({ ctx, input }) => {
        const { userId, itemId, itemType } = input;

        // Check if the user exists
        const existingUser = await ctx.db.user.findUnique({
            where: { id: userId },
        });

        if (!existingUser) {
            throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
        }

        // Check if the item already exists in the user's favorite list
        const existingFavItem = await ctx.db.userFavList.findFirst({
            where: {
                userId: userId,
                itemId: itemId,
                itemType: itemType,
            },
        });

        if (existingFavItem) {
            throw new TRPCError({ code: "BAD_REQUEST", message: `${itemType} already exists in user's list` });
        }

        // Create a new favorite item for the user
        await ctx.db.userFavList.create({
            data: {
                userId: userId,
                itemId: itemId,
                itemType: itemType,
            },
        });

        return { success: true };
    }),
  removeFromUserFavList: publicProcedure
    .input(z.object({ userId: z.string(), itemId: z.string(), itemType: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId, itemId, itemType } = input;
  
      // Check if the user exists
      const existingUser = await ctx.db.user.findUnique({
        where: { id: userId },
      });
  
      if (!existingUser) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }
  
      // Check if the item exists in the user's favorite list
      const existingFavItem = await ctx.db.userFavList.findFirst({
        where: {
          userId: userId,
          itemId: itemId,
          itemType: itemType,
        },
      });
  
      if (!existingFavItem) {
        throw new TRPCError({ code: "NOT_FOUND", message: `${itemType} not found in user's list` });
      }
  
      // Delete the favorite item from the user's list
      await ctx.db.userFavList.delete({
        where: {
          id: existingFavItem.id,
        },
      });
  
      return { success: true };
    }),
  

  fetchAllMovies: publicProcedure
    .query(async ({ ctx }) => {
      try {
        const movies = await ctx.db.movie.findMany();
        return movies;
      } catch (error) {
        console.error("Error fetching movies:", error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to fetch movies" });
      }
    }),

  fetchAllTVShows: publicProcedure
    .query(async ({ ctx }) => {
      try {
        const tvShows = await ctx.db.tVShow.findMany();
        return tvShows;
      } catch (error) {
        console.error("Error fetching TV shows:", error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to fetch TV shows" });
      }
    }),
  
    fetchMyList: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const { userId } = input;
        const myList = await ctx.db.userFavList.findMany({
          where: { userId: userId },
        });
        console.log(myList);
        // Initialize arrays to store favorite movies and TV shows
        const favMovieList = [];
        const favTVShowList = [];
  
        // Iterate through the user's favorite list items
        for (const item of myList) {
          if (item.itemType === "Movie") {
            // Fetch movie item from Movie model and add it to favMovieList
            const movie = await ctx.db.movie.findUnique({
              where: { id: item.itemId },
            });
            if (movie) {
              favMovieList.push(movie);
            }
          } else if (item.itemType === "TVShow") {
            // Fetch TV show item from TVShow model and add it to favTVShowList
            const tvShow = await ctx.db.tVShow.findUnique({
              where: { id: item.itemId },
            });
            if (tvShow) {
              favTVShowList.push(tvShow);
            }
          }
        }
  
        // Return both favorite movie and TV show lists
        return { favMovieList, favTVShowList };
      } catch (error) {
        console.error("Error fetching user's favorite list:", error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Failed to fetch user's favorite list" });
      }
    }),

});
