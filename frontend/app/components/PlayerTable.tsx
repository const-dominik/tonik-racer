// This component is AI-generated

"use client";

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    SortingState,
    useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { SentPlayer } from "../../../types/types";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./shadcn/table";

interface PlayerTableProps {
    players: SentPlayer[];
}

const PlayerTable = ({ players }: PlayerTableProps) => {
    const [sorting, setSorting] = useState<SortingState>([]);

    const columns = useMemo<ColumnDef<SentPlayer>[]>(
        () => [
            {
                accessorKey: "nickname",
                header: ({ column }) => (
                    <div
                        style={{ cursor: "pointer", userSelect: "none" }}
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        Nickname{" "}
                        {column.getIsSorted()
                            ? column.getIsSorted() === "asc"
                                ? "↑"
                                : "↓"
                            : ""}
                    </div>
                ),
            },
            {
                accessorKey: "progress",
                header: ({ column }) => (
                    <div
                        style={{ cursor: "pointer", userSelect: "none" }}
                        onClick={() =>
                            column.toggleSorting(column.getIsSorted() === "asc")
                        }
                    >
                        Progress{" "}
                        {column.getIsSorted()
                            ? column.getIsSorted() === "asc"
                                ? "↑"
                                : "↓"
                            : ""}
                    </div>
                ),
                cell: ({ row }) => (
                    <span>{row.getValue<number>("progress")}%</span>
                ),
            },
        ],
        []
    );

    const table = useReactTable({
        data: players,
        columns,
        state: { sorting },
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    });

    return (
        <Table>
            <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                            <TableHead key={header.id}>
                                {flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                )}
                            </TableHead>
                        ))}
                    </TableRow>
                ))}
            </TableHeader>
            <TableBody>
                {table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                                {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                )}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};

export default PlayerTable;
