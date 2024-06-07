import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";


 const PageWithAuth = (Component:NextPage) => {

  const AuthenticatedComponent = () => {
      const router = useRouter();
      let isAuthenticated:boolean=false;
      
      
      const [ isAuth, setIsAuth ] = useState(false)
      
      useEffect(() => {
        if(sessionStorage.getItem("token")){
            isAuthenticated=true;
        }

        const getUser = async () => {
            if (!isAuthenticated) {
                router.push('/login');
            } else {
                setIsAuth(true)
            }
        };
        getUser();
      }, [isAuthenticated, router]);

      return !!isAuth ? <Component /> : null; // Render whatever you want while the authentication occurs
  };

  return AuthenticatedComponent;
};

export default PageWithAuth;