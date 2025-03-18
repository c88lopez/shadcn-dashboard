import React, { RefObject } from "react";
import { DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { UserGroup } from "@vandelay-labs/schemas";

type MenuItemProps = {
  updateSelectedGroups: (cuid: string, add: boolean) => void;
  group: Pick<UserGroup, "cuid" | "name">;
  disabled?: boolean;
  selectedGroups: RefObject<string[]>;
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
      disabled={props.disabled}
      onCheckedChange={(isChecked) =>
        onCheckedChange(isChecked ? props.group.cuid : "")
      }
    >
      {props.group.name}
    </DropdownMenuCheckboxItem>
  );
}
