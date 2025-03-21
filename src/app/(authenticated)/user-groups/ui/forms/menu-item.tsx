import React, { RefObject } from "react";
import { DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { User } from "@vandelay-labs/schemas";

type MenuItemProps = {
  user: Pick<User, "cuid" | "username">;
  selectedUsers: RefObject<User["cuid"][]>;
  updateSelectedUsers: (cuid: User["cuid"], add: boolean) => void;
};

export default function MenuItem({ ...props }: MenuItemProps) {
  const itemChecked = props.selectedUsers.current.some(
    (userCuid: string) => userCuid === props.user.cuid,
  );

  const [checked, setChecked] = React.useState<string>(
    itemChecked ? props.user.cuid : "",
  );

  function onCheckedChange(isChecked: string) {
    setChecked(isChecked);

    // Add cuid if checked, remove if unchecked
    if (props.updateSelectedUsers) {
      props.updateSelectedUsers(props.user.cuid, isChecked !== "");
    }
  }

  return (
    <DropdownMenuCheckboxItem
      onSelect={(event) => {
        event.preventDefault();
      }}
      checked={checked !== ""}
      onCheckedChange={(isChecked) =>
        onCheckedChange(isChecked ? props.user.cuid : "")
      }
    >
      {props.user.username}
    </DropdownMenuCheckboxItem>
  );
}
