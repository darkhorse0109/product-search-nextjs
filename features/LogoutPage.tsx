"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingIndicator from "@/components/loading-indicator";

const LogOutPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const signOut = async () => {
      setIsLoading(true);
      localStorage.removeItem("jwt-token");
      router.push("/login");
      setIsLoading(false);
    };
    void signOut();
  }, []);

  return isLoading ? <LoadingIndicator /> : <></>;
};

export default LogOutPage;
