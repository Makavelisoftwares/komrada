import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { PlusCircle } from "lucide-react";

export const CreateBusinessAlertBox = () => {
  return (
    <AlertDialog>
      <AlertDialogTrigger className="flex items-center space-x-2">
        <PlusCircle />
        <span>Create Business</span>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Create Business</AlertDialogTitle>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
};
