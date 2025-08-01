"use client";
import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { register } from "@/redux/reducerSlice/userSlice";
import Link from "next/link";

const SignupForm = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [avatar, setAvatar] = useState(null);

  const validationSchema = Yup.object({
    fullName: Yup.string().required("Full name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const registerUser = async (values) => {
    try {
      const formData = new FormData();
      formData.append("fullName", values.fullName);
      formData.append("email", values.email);
      formData.append("password", values.password);
      if (avatar) {
        formData.append("avatar", avatar);
      }

      const res = await axios.post(
        "http://localhost:9000/api/register",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.status === 201) {
        dispatch(register(res.data.user));
        router.push("/login");
      }
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: registerUser,
  });

  return (
    <div className="w-full h-screen bg-gradient-to-br from-gray-900 to-black flex justify-center items-center">
      <form
        onSubmit={formik.handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-[90%] max-w-md"
        encType="multipart/form-data"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Create New Account
        </h2>
        <div className="mb-4">
          <label
            htmlFor="fullName"
            className="block text-sm mb-1 text-gray-700"
          >
            Full Name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            onChange={formik.handleChange}
            value={formik.values.fullName}
            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          {formik.errors.fullName && (
            <p className="text-sm text-red-500 mt-1">
              {formik.errors.fullName}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm mb-1 text-gray-700">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            onChange={formik.handleChange}
            value={formik.values.email}
            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          {formik.errors.email && (
            <p className="text-sm text-red-500 mt-1">{formik.errors.email}</p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm mb-1 text-gray-700"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            onChange={formik.handleChange}
            value={formik.values.password}
            className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          {formik.errors.password && (
            <p className="text-sm text-red-500 mt-1">
              {formik.errors.password}
            </p>
          )}
        </div>
        <div className="mb-6">
          <label htmlFor="avatar" className="block text-sm mb-1 text-gray-700">
            Upload Avatar
          </label>
          <input
            id="avatar"
            name="avatar"
            type="file"
            accept="image/*"
            onChange={(e) => setAvatar(e.target.files[0])}
            className="w-full text-sm text-gray-600"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-black text-white py-2 rounded cursor-pointer"
        >
          Submit
        </button>
        <p className="text-sm text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignupForm;
