"use client";

import { useEffect, useState } from "react";

import { loginCheck } from "@/utils/common";

import Loading from "@/components/common/Loading";

const AuthRequired = ({ children }: { children?: React.ReactNode }) => {
  const [isAuthed, setIsAuted] = useState(false);

  useEffect(() => {
    setIsAuted(loginCheck());
  }, []);

  if (!isAuthed) {
    return (
      <div className="absolute left-1/2 -translate-x-1/2 top-1/2">
        <Loading />
      </div>
    );
  }

  return children;
};

export default AuthRequired;
