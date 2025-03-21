import React, { RefObject } from "react";
import { DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";

type MenuItemProps = {
  entity: { cuid: string; displayName: string };
  selectedList: RefObject<string[]>;
  updateSelectedList: (cuid: string, add: boolean) => void;
};

export default function MenuItem({ ...props }: MenuItemProps) {
  const itemChecked = props.selectedList.current.some(
    (userCuid: string) => userCuid === props.entity.cuid,
  );

  const [checked, setChecked] = React.useState<string>(
    itemChecked ? props.entity.cuid : "",
  );

  function onCheckedChange(isChecked: string) {
    setChecked(isChecked);

    // Add cuid if checked, remove if unchecked
    if (props.updateSelectedList) {
      props.updateSelectedList(props.entity.cuid, isChecked !== "");
    }
  }

  return (
    <DropdownMenuCheckboxItem
      onSelect={(event) => {
        event.preventDefault();
      }}
      checked={checked !== ""}
      onCheckedChange={(isChecked) =>
        onCheckedChange(isChecked ? props.entity.cuid : "")
      }
    >
      {props.entity.displayName}
    </DropdownMenuCheckboxItem>
  );
}
