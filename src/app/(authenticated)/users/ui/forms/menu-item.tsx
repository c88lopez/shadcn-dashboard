import React from "react";
import { DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";

export default function MenuItem({ ...props }) {
  const itemChecked = props.selectedTeams.current.some(
    (teamCuid: string) => teamCuid === props.team.cuid,
  );

  const [checked, setChecked] = React.useState<string>(
    itemChecked ? props.team.cuid : "",
  );

  function onCheckedChange(isChecked: string) {
    setChecked(isChecked);
    props.updateSelectedTeams(props.team.cuid, isChecked);
  }

  return (
    <DropdownMenuCheckboxItem
      onSelect={(event) => {
        event.preventDefault();
      }}
      checked={checked !== ""}
      disabled={props.disabled}
      onCheckedChange={(isChecked) =>
        onCheckedChange(isChecked ? props.team.cuid : "")
      }
    >
      {props.team.name}
    </DropdownMenuCheckboxItem>
  );
}
