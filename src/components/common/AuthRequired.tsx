"use client";

import { useState } from "react";

import { loginCheck } from "@/utils/common";
import { useDidMountEffect } from "@/hooks/common";

import Loading from "@/components/common/Loading";

const AuthRequired = ({ children }: { children?: React.ReactNode }) => {
  const [isAuthed, setIsAuted] = useState(false);

  useDidMountEffect(() => {
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
