import React, { RefObject } from "react";
import { DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { UserGroup } from "@vandelay-labs/schemas";

type MenuItemProps = {
  group: Pick<UserGroup, "cuid" | "name">;
  selectedGroups: RefObject<UserGroup["cuid"][]>;
  updateSelectedGroups: (cuid: UserGroup["cuid"], add: boolean) => void;
};

export default function MenuItem({ ...props }: MenuItemProps) {
  const itemChecked = props.selectedGroups.current.some(
    (groupCuid: string) => groupCuid === props.group.cuid,
  );

  const [checked, setChecked] = React.useState<string>(
    itemChecked ? props.group.cuid : "",
  );

  function onCheckedChange(isChecked: string) {
    setChecked(isChecked);

    // Add cuid if checked, remove if unchecked
    props.updateSelectedGroups(props.group.cuid, isChecked !== "");
  }

  return (
    <DropdownMenuCheckboxItem
      onSelect={(event) => {
        event.preventDefault();
      }}
      checked={checked !== ""}
      onCheckedChange={(isChecked) =>
        onCheckedChange(isChecked ? props.group.cuid : "")
      }
    >
      {props.group.name}
    </DropdownMenuCheckboxItem>
  );
}
