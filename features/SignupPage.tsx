"use client";

import Link from "next/link";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { HiMiniArrowRightStartOnRectangle } from "react-icons/hi2";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import InputField from "@/components/input/input-field";
import RequiredLabel from "@/components/label/required-label";

interface ISignUpForm {
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignupPage() {
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const schema = yup.object().shape({
    email: yup
      .string()
      .required("メールアドレスは必須です")
      .email("メールアドレスを正しく入力してください"),
    password: yup.string().required("パスワードは必須です"),
    confirmPassword: yup.string().required("パスワード（確認用）は必須です"),
  });

  const {
    control, handleSubmit,
    formState: { errors },
  } = useForm<ISignUpForm>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: ISignUpForm) => {
    const { email, password, confirmPassword } = data;

    if (password !== confirmPassword) {
      setError("パスワードと確認用パスワードが一致しません");
      return;
    }

    if (password.length < 6) {
      setError("パスワードは6文字以上である必要があります");
      return;
    }

    const { data: { error }, status } = await axios.post("/api/auth/sign-up", {
      email,
      password,
    });

    if (status === 200) {
      if (error === "Existing email") {
        setError("このメールアドレスはすでに登録されています");
        setSuccess("");
        return;
      } else {
        setError("");
        setSuccess("登録されました。")
      }
    } else {
      setError("登録に失敗しました。");
      setSuccess("");
    }
  };

  return (
    <div className="w-[450px] m-auto">
      <div className="bg-white w-full m-4 px-10 pt-8 pb-10">
        <figure className="flex justify-center mb-5">
          <Image
            src="/android-chrome-512x512.png"
            width={125}
            height={80}
            alt="LOGO"
          />
        </figure>
        <div className="text-center">
          <h1 className="text-xl font-semibold">サインアップ</h1>
          <p className="m-2 text-sm">PDF変換と製品比較システム</p>
        </div>

        {!errors.email && !errors.password && error && (
          <p className="text-sm text-center mt-4 text-m-red">{error}</p>
        )}

        { success && (
          <div className="w-full mt-4 bg-green-50 border-l-4 border-green-400 p-4 text-sm text-green-700">
            <div className="flex flex-col items-center space-y-2">
              <span>{success}</span>
              <Link href={`/login`} className="text-m-blue-hover font-semibold hover:underline flex items-center space-x-1">
                <span>ログインページへ</span>
                <HiMiniArrowRightStartOnRectangle className="text-lg" />
              </Link>
            </div>
          </div>
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
            <div className="flex mt-6 mb-2">
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

          <div className="flex flex-col">
            <div className="flex mt-6 mb-2">
              <Label htmlFor="confirmPassword">パスワード（確認用）</Label>
              <RequiredLabel />
            </div>
            <div className="w-full">
              <InputField id="confirmPassword" control={control} className="w-full" isPassword/>
              {errors.confirmPassword && (
                <p className="text-sm mt-3 text-m-red">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          {/* Register Button */}
          <div className="flex items-start my-6">
            <div className="w-full">
              <Button
                type="submit"
                className="w-full px-[30px] py-[4px] text-[18px] rounded-[1px] bg-m-blue text-white hover:bg-m-blue-hover transition-colors duration-300"
              >
                サインアップ
              </Button>
            </div>
          </div>
        </form>

        <div className="w-full text-center text-sm flex items-center justify-center mt-6">
          アカウントをお持ちの方は
          <Link href="/login" className="flex items-center font-semibold">
            <span className="text-m-blue-hover">こちら</span>
            <HiMiniArrowRightStartOnRectangle className="text-lg ml-3" />
          </Link>
          </div>
      </div>
    </div>
  );
}
