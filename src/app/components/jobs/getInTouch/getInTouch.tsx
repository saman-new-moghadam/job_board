"use client";

import { User } from "@/utility/auth";
import { JobDetail } from "@/utility/jobs";
import { FormEvent, useState } from "react";

const GetInTouch = ({
  job,
  id,
  user,
}: {
  id: string;
  job: JobDetail;
  user: User | null;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [resume, setResume] = useState<File>();
  const [message, setMessage] = useState({
    open: false,
    success: false,
    message: "",
  });

  const [isDisabledButton, setIsDisabledButton] = useState(false);

  const handleGetInTouchButton = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsDisabledButton(true);
    setMessage({
      open: false,
      success: false,
      message: "",
    });
    try {
      const formData = new FormData();

      if (!coverLetter || !resume) {
        setMessage({
          message: "cover letter and resume is required.",
          open: true,
          success: false,
        });
        return;
      }

      formData.set("coverLetter", coverLetter);
      formData.set("resume", resume);

      const response = await fetch(`/api/jobs/${id}/applications`, {
        body: formData,
        method: "POST",
      });

      const responseMessage = await response.json();
      if (response.ok) {
        setMessage({
          message: "successfully sent",
          open: true,
          success: true,
        });
      } else {
        setMessage({
          message:
            typeof responseMessage.error === "string"
              ? responseMessage.error
              : responseMessage.error?.message || "Something went wrong",
          open: true,
          success: false,
        });
      }
    } catch {
      setMessage({
        message: "spmething went wrong",
        open: true,
        success: false,
      });
    } finally {
      setIsDisabledButton(false);
    }
  };
  return (
    <>
      <div className="flex justify-between items-center">
        <div>
          <h3>
            {job.user.firstName} {job.user.lastName}
          </h3>
          {job.status === "OPEN" ? (
            <p className="text-[10px] text-green-600">Available for work</p>
          ) : (
            <p className="text-[10px] text-red-600">Not Available</p>
          )}
        </div>

        {user && user.role === "JOB_SEEKER" && job.status === "OPEN" && (
          <div>
            <button
              onClick={handleGetInTouchButton}
              className="
                  bg-black 
                  text-white 
                  px-5 p-3 
                  rounded-4xl 
                  w-[146px] 
                  h-[48px]
                  text-md cursor-pointer"
            >
              {isOpen ? "Close" : "Get in touch"}
            </button>
          </div>
        )}
      </div>

      {isOpen && (
        <div>
          {message.open && (
            <div
              className={
                message.success
                  ? "bg-green-200 p-4 mt-5 rounded-sm font-semibold"
                  : "bg-red-200 p-4 mt-5 rounded-sm font-semibold"
              }
            >
              {message.message}
            </div>
          )}
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-10">
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.currentTarget.value)}
              className="w-full mt-10 outline-0 border-2 border-gray-300 p-3 rounded-xl"
              placeholder="say something as cover letter"
            />
            <input
              type="file"
              accept=".pdf,application/pdf"
              multiple={false}
              onChange={(e) => {
                const file = e.currentTarget.files?.[0];

                if (!file) {
                  setResume(undefined);
                  return;
                }

                if (file.type !== "application/pdf") {
                  setResume(undefined);
                  setMessage({
                    message: "Only PDF files are allowed.",
                    open: true,
                    success: false,
                  });
                  e.currentTarget.value = "";
                  return;
                }

                setResume(file);
              }}
              className="border-2 border-gray-300 p-3"
            />
            <button
              type="submit"
              className={`
              bg-black 
            text-white 
              px-5 p-3 rounded-xl
              cursor-pointer
              ${isDisabledButton && "bg-gray-500!"}
            `}
              disabled={isDisabledButton}
            >
              {isDisabledButton ? "Submitting..." : "submit"}
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default GetInTouch;
