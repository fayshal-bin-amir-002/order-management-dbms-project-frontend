import { TableRow, TableCell } from "@/components/ui/table";

const TableLoader = ({
  columns = 5,
  rows = 5,
}: {
  columns: number;
  rows: number;
}) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={rowIndex}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <TableCell key={colIndex}>
              <div className="h-4 bg-muted rounded animate-pulse w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
};

export default TableLoader;
