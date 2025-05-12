import { toast } from "../hooks/use-toast";
import { CheckCheck, CircleX, TriangleAlert } from "lucide-react";

export const handleSuccessToast = (message: string): void => {
  toast({
    description: (
      <div className="flex items-center gap-2 text-slate-800 text-sm">
        <CheckCheck className="w-5 h-5 " />
        <span>{message}</span>
      </div>
    ),
    duration: 2500,
    style: {
      backgroundColor: "#b6f8c4",
    },
  });
};

export const handleSuccessToastWithLink = (
  message: string,
  link: string
): void => {
  toast({
    description: (
      <div className="flex items-center gap-2 text-slate-800 text-sm">
        <CheckCheck className="w-5 h-5 " />
        <span>{message}</span>
        {/* <Link className="font-semibold hover:underline" href={link.toString()}>
          Login Now
        </Link> */}
      </div>
    ),
    duration: 2500,
    style: {
      backgroundColor: "#b6f8c4",
    },
  });
};

export const handleFailureToast = (message: string): void => {
  toast({
    variant: "destructive",
    description: (
      <div className="flex items-center gap-2 text-white text-sm">
        <CircleX className="w-5 h-5 " />
        <span>{message}</span>
      </div>
    ),
  });
};

export const handleWarningToast = (message: string): void => {
  toast({
    description: (
      <div className="flex items-center gap-2 text-slate-800 text-sm">
        <TriangleAlert className="w-5 h-5 " />
        <span>{message}</span>
      </div>
    ),
    duration: 2500,
    style: {
      backgroundColor: "#fae7c7",
    },
  });
};
