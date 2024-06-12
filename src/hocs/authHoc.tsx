import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";


 const PageWithAuth = (Component:NextPage) => {
  const AuthComponent= ()=>{
    const router = useRouter();
    useEffect(()=>{
      if(!sessionStorage.getItem("token") ?? sessionStorage.getItem("token")==""){
        router.push('/login').catch(err => {
          console.error('Failed to navigate to login:', err);
        });
      }
    },[]);
    return <Component />
  }
  return AuthComponent;

  // const AuthenticatedComponent = () => {
  //     const router = useRouter();
  //     let isAuthenticated=false;
      
      
  //     const [ isAuth, setIsAuth ] = useState(false)
      
  //     useEffect(() => {
  //       if(sessionStorage.getItem("token")){
  //           isAuthenticated=true;
  //           setIsAuth(true);
  //       }else{
  //           router.push('/login');
  //       }
  //     }, [isAuthenticated, router]);

  //     return !!isAuth ? <Component /> : null; // Render whatever you want while the authentication occurs
  // };

  // return AuthenticatedComponent;
};

export default PageWithAuth;