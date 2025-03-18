import React, { RefObject } from "react";
import { DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { UserGroup } from "@vandelay-labs/schemas";

type MenuItemProps = {
  updateSelectedGroups: (cuid: string, add: boolean) => void;
  userGroup: UserGroup;
  disabled?: boolean;
  selectedUsers: RefObject<string[]>;
};

export default function MenuItem({ ...props }: MenuItemProps) {
  const itemChecked = props.selectedUsers.current.some(
    (groupCuid: string) => groupCuid === props.userGroup.cuid,
  );

  const [checked, setChecked] = React.useState<string>(
    itemChecked ? props.userGroup.cuid : "",
  );

  function onCheckedChange(isChecked: string) {
    setChecked(isChecked);

    // Add cuid if checked, remove if unchecked
    props.updateSelectedGroups(props.userGroup.cuid, isChecked !== "");
  }

  return (
    <DropdownMenuCheckboxItem
      onSelect={(event) => {
        event.preventDefault();
      }}
      checked={checked !== ""}
      disabled={props.disabled}
      onCheckedChange={(isChecked) =>
        onCheckedChange(isChecked ? props.userGroup.cuid : "")
      }
    >
      {props.userGroup.name}
    </DropdownMenuCheckboxItem>
  );
}
