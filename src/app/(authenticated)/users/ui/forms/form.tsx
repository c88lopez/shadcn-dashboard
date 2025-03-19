import ApiClient from "@/lib/api/client";
import { User } from "@vandelay-labs/schemas";

type UserSheetFormProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  apiClient: ApiClient;
  user?: User;
};

export default function UserSheetForm({ ...props }: UserSheetFormProps) {
  return <div></div>;
}
