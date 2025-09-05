"use client";

import Link from "next/link";
import { Ban, ArrowLeft } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center">
          <Ban className="w-16 h-16 text-red-500" />
        </div>
        <h1 className="text-4xl font-bold mt-4 text-gray-800">
          404 - Not Found
        </h1>
        <p className="mt-2 text-gray-600">
          Sorry, the page you are looking for doesn&apos;t exist or has been
          moved.
        </p>

        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 px-5 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
