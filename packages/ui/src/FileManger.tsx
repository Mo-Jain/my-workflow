import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";

interface FileManagerProps {
  headers: string[];
  items: any[];
  toggleFavorite?: (id: number) => void;
  hasSelect: boolean;
  iconOne?: (item: any) => JSX.Element;
  iconTwo?: (item: any) => JSX.Element;
}

export default function FileManager({
  headers,
  items,
  toggleFavorite,
  hasSelect,
  iconOne,
  iconTwo,
}: FileManagerProps) {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "asc" | "desc";
  }>({ key: "name", direction: "asc" });

  const toggleAll = (checked: boolean) => {
    setSelectedItems(checked ? items.map((item) => item.id) : []);
  };

  const toggleItem = (itemId: number) => {
    setSelectedItems((current) =>
      current.includes(itemId)
        ? current.filter((id) => id !== itemId)
        : [...current, itemId]
    );
  };

  const handleSort = (key: string) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc",
    });
  };

  return (
    <div>
      <div className="w-full">
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              {hasSelect && (
                <TableCell className="w-12">
                  <Checkbox
                    checked={selectedItems.length === items.length}
                    onCheckedChange={toggleAll}
                  />
                </TableCell>
              )}
              {headers.map((header) => {
                const isSorted = sortConfig.key === header.toLowerCase();
                return (
                  <TableHead
                    key={header}
                    className="cursor-pointer items-center gap-2"
                    onClick={() => handleSort(header.toLowerCase())}
                  >
                    {header}
                    <span className="inline-block w-2">
                      {isSorted ? (sortConfig.direction === "asc" ? "↑" : "↓") : ""}
                    </span>
                  </TableHead>
                );
              })}
              {toggleFavorite && <TableHead className="w-12"></TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow
                key={item.id}
                className={`${
                  selectedItems.includes(item.id) ? "bg-gray-200" : ""
                } hover:bg-gray-200 cursor-pointer`}
              >
                {hasSelect && (
                  <TableCell>
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onCheckedChange={() => toggleItem(item.id)}
                    />
                  </TableCell>
                )}
                {Object.entries(item)
                  .filter(([key]) => key !== "id" && key !== "type") // Exclude "type" from being rendered
                  .map(([key, value], index) => (
                    <>
                      {index <= 1 && (
                        <TableCell key={key} className="items-center gap-2">
                          <div className="flex items-center gap-2">
                            {index === 0 && iconOne && <div className="flex gap-2">{iconOne(item)}</div>}
                            {index === 1 && iconTwo && <div>{iconTwo(item)}</div>}
                            {item[key]}
                          </div>
                        </TableCell>
                      )}
                      {index > 1 && (
                        <TableCell key={key}>
                          {item[key]}
                        </TableCell>
                      )}
                    </>
                  ))}
                {toggleFavorite && (
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => toggleFavorite(item.id)}
                    >
                      <Star
                        className={`h-4 w-4 ${
                          item.isFavorite ? "fill-yellow-400 text-yellow-400" : ""
                        }`}
                      />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
