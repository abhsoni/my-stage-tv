import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken';
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const authToken=request.headers.get("authorization");
    if (request.nextUrl.pathname.startsWith('/home-page')) {
  
        if(authToken==""){
          console.log("Invalid Header."); 
        }
        console.log("Invalid Header."); 
        console.log(authToken); 
        
        // You can also set request headers in NextResponse.rewrite
        const response = NextResponse.next();
        // Set a new response header `x-hello-from-middleware2`
        return response;
      }
     
      if (request.nextUrl.pathname.startsWith('/dashboard')) {
        return NextResponse.rewrite(new URL('/dashboard/user', request.url))
      }
      // console.log("from middleware");
      console.log(authToken);
}
 
// See "Matching Paths" below to learn more
// export const config = {
//   matcher: '/about/:path*',
// }