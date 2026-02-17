/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
import * as React from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  IconChevronLeft,
  IconChevronRight,
  IconDotsVertical,
  IconTrash,
} from "@tabler/icons-react";
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type Row,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { z } from "zod";

import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent } from "@/components/ui/tabs";

export const schema = z.object({
  id: z.string(),
  name: z.string(),
  code: z.string(),
  value: z.number(),
});

type ProductType = z.infer<typeof schema>;

interface DataTableProductsProps {
  data: ProductType[];
  onDelete?: (id: string) => void;
  onUpdate?: (product: ProductType) => void;
}

const columns: ColumnDef<ProductType>[] = [
  {
    accessorKey: "code",
    header: "Código",
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate font-medium">
        {row.original.code}
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "Nome do produto",
    cell: ({ row, table }) => {
      const meta = table.options.meta as { onUpdate?: (p: ProductType) => void };
      return <TableCellViewer item={row.original} onUpdate={meta?.onUpdate} />;
    },
    enableHiding: false,
  },
  {
    accessorKey: "value",
    header: "Preço Unit.",
    cell: ({ row }) => (
      <span>
        {row.original.value.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const meta = table.options.meta as { onDelete?: (id: string) => void };
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
              size="icon"
            >
              <IconDotsVertical size={16} />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem 
              className="text-destructive focus:text-destructive"
              onClick={() => {
                if(confirm("Tem certeza que deseja excluir este produto?")) {
                   meta?.onDelete?.(row.original.id);
                }
              }}
            >
              <IconTrash className="mr-2 h-4 w-4" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

function DraggableRow({ row }: { row: Row<ProductType> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  });

  return (
    <TableRow
      data-state={row.getIsSelected() && "selected"}
      data-dragging={isDragging}
      ref={setNodeRef}
      className="relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80 data-[dragging=true]:bg-muted"
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}
    >
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

export function DataTableProducts({
  data: initialData,
  onDelete,
  onUpdate,
}: DataTableProductsProps) {
  const [data, setData] = React.useState<ProductType[]>(initialData);

  React.useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const sortableId = React.useId();
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor)
  );

  const dataIds = React.useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    meta: {
      onDelete,
      onUpdate,
    },
    getRowId: (row) => row.id,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id);
        const newIndex = dataIds.indexOf(over.id);
        return arrayMove(data, oldIndex, newIndex);
      });
    }
  }

  return (
    <Tabs defaultValue="table" className="w-full flex-col justify-start gap-6">
      <TabsContent
        value="table"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="overflow-hidden rounded-lg border">
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            id={sortableId}
          >
            <Table>
              <TableHeader className="bg-muted sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  <SortableContext
                    items={dataIds}
                    strategy={verticalListSortingStrategy}
                  >
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      Nenhum produto encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>

        {/* Paginação */}
        <div className="flex items-center justify-between px-4 pb-4 mt-4">
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Linhas por página
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => table.setPageSize(Number(value))}
              >
                <SelectTrigger className="w-20" id="rows-per-page">
                  <SelectValue placeholder={table.getState().pagination.pageSize} />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm font-medium">
              Página {table.getState().pagination.pageIndex + 1} de {table.getPageCount()}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <IconChevronLeft size={16} />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <IconChevronRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}

function TableCellViewer({ 
  item, 
  onUpdate 
}: { 
  item: ProductType, 
  onUpdate?: (p: ProductType) => void 
}) {
  const isMobile = useIsMobile();
  const [formData, setFormData] = React.useState<ProductType>(item);

  React.useEffect(() => {
    setFormData(item);
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate?.(formData);
  };

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button
          variant="link"
          className="text-foreground w-fit px-0 text-left font-mono h-auto"
        >
          {item.name}
        </Button>
      </DrawerTrigger>

      <DrawerContent className="h-[85vh] sm:h-full sm:max-w-md ml-auto">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <DrawerHeader className="gap-1">
            <DrawerTitle>Detalhes do Produto</DrawerTitle>
            <DrawerDescription>ID: {item.id}</DrawerDescription>
          </DrawerHeader>

          <div className="flex flex-col gap-6 overflow-y-auto px-6 text-sm">
            <div className="flex flex-col gap-3">
              <Label htmlFor="edit-name">Nome do Produto</Label>
              <Input 
                id="edit-name" 
                value={formData.name} 
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="edit-code">Código</Label>
                <Input 
                  id="edit-code" 
                  value={formData.code} 
                  onChange={(e) => setFormData({...formData, code: e.target.value})}
                />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="edit-value">Preço Unitário</Label>
                <Input 
                  id="edit-value" 
                  type="number"
                  step="0.01"
                  value={formData.value} 
                  onChange={(e) => setFormData({...formData, value: Number(e.target.value)})}
                />
              </div>
            </div>
          </div>

          <DrawerFooter className="mt-auto border-t p-6">
            <Button type="submit">Salvar Alterações</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DrawerClose>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
}