import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { TableRow } from "./ui/table"

export function SortableItem(props: any) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
    } = useSortable({id: props.id})
    
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    }
    
    return (
      <TableRow ref={setNodeRef} style={style} onClick={props.onClick} onDoubleClick={props.onDoubleClick} {...attributes} {...listeners}>
        {props.children}
      </TableRow>
    )
  }