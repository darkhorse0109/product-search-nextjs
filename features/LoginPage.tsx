"use client";

import Link from "next/link";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { yupResolver } from "@hookform/resolvers/yup";

import { HiMiniArrowRightStartOnRectangle } from "react-icons/hi2";

import useLocalStorage from "@/hooks/use-local-storage";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import InputField from "@/components/input/input-field";
import RequiredLabel from "@/components/label/required-label";

interface ILogInForm {
  email: string;
  password: string;
}

export default function LogInPage() {
  const router = useRouter();
  const [error, setError] = useState<string>("");

  const schema = yup.object().shape({
    email: yup
      .string()
      .required("メールアドレスは必須です")
      .email("メールアドレスを正しく入力してください"),
    password: yup.string().required("パスワードは必須です"),
  });

  const {
    control, handleSubmit,
    formState: { errors },
  } = useForm<ILogInForm>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: ILogInForm) => {
    const { email, password } = data;

    const { data: { access_token, refresh_token, error }, status } = await axios.post("/api/auth/login", {
      email,
      password,
    });

    if (status === 200) {
      if (error === "Invalid email") {
        setError("メールアドレスは存在しません。");
        return;
      } else if (error === "Invalid password") {
        setError("パスワードが違います。");
        return;
      } else {
        localStorage.setItem("jwt-token", JSON.stringify({
          access_token,
          refresh_token
        }))
        router.push("/pdf-converter");
      }
    } else {
      setError("メールアドレスかパスワードが違います。");
    }
  };

  return (
    <div className="w-full max-w-[450px] px-4 sm:px-0 sm:w-[450px] m-auto">
      <div className="bg-white w-full px-6 sm:px-10 pt-8 pb-10">
        <figure className="flex justify-center mb-5">
          <Image
            src="/android-chrome-512x512.png"
            width={125}
            height={80}
            alt="LOGO"
          />
        </figure>
        <div className="text-center">
          <h1 className="text-xl font-semibold">ログイン</h1>
          <p className="m-2 text-sm">PDF変換と製品比較システム</p>
        </div>

        {!errors.email && !errors.password && error && (
          <p className="text-sm mt-3 text-center text-m-red">{error}</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col">
            <div className="flex items-center mt-6 mb-2">
              <Label htmlFor="email">メールアドレス</Label>
              <RequiredLabel />
            </div>
            <div className="w-full">
              <InputField id="email" control={control} className="w-full" />
              {errors.email && (
                <p className="text-sm mt-3 text-m-red">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center mt-6 mb-2">
              <Label htmlFor="password">パスワード</Label>
              <RequiredLabel />
            </div>
            <div className="w-full">
              <InputField id="password" control={control} className="w-full" isPassword/>
              {errors.password && (
                <p className="text-sm mt-3 text-m-red">{errors.password.message}</p>
              )}
            </div>
          </div>

          {/* Register Button */}
          <div className="flex items-start my-6">
            <div className="w-full">
              <Button
                type="submit"
                className="w-full px-[30px] py-[4px] text-[18px] rounded-[1px] bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300"
              >
                ログイン
              </Button>
            </div>
          </div>
        </form>

        <div className="w-full text-center text-sm flex items-center justify-center mt-6">
          アカウントをお持ちでない方は
          <Link href="/sign-up" className="flex items-center font-semibold">
            <span className="text-blue-600">こちら</span>
            <HiMiniArrowRightStartOnRectangle className="text-lg ml-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
