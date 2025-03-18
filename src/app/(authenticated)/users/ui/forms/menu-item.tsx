import React from "react";
import { DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";

export default function MenuItem({ ...props }) {
  const itemChecked = props.selectedTeams.current.some(
    (teamCuid: string) => teamCuid === props.group.cuid,
  );

  const [checked, setChecked] = React.useState<string>(
    itemChecked ? props.group.cuid : "",
  );

  function onCheckedChange(isChecked: string) {
    setChecked(isChecked);
    props.updateSelectedTeams(props.group.cuid, isChecked);
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
