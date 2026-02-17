/* eslint-disable react-hooks/set-state-in-effect */
import { AppSidebar } from "@/components/app-sidebar";
import { DataTableRawMaterial } from "@/components/data-table_rawMaterial";
import { ModeToggle } from "@/components/mode-toggle";
import api from "@/connection/api";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

// Tipo atualizado para RawMaterial
type RawMaterialType = {
  id: string;
  code: string;
  name: string;
  stockQuantity: number;
};

export const RegisterRawMaterial = () => {
  const [materials, setMaterials] = useState<RawMaterialType[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [newMaterial, setNewMaterial] = useState({
    code: "",
    name: "",
    stockQuantity: 0,
  });

  const loadMaterials = async () => {
    try {
      const response = await api.get("/material");
      setMaterials(response.data);
    } catch (error) {
      console.log("Erro ao carregar matérias-primas:", error);
    }
  };

  useEffect(() => {
    loadMaterials();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/material", newMaterial);

      setNewMaterial({
        code: "",
        name: "",
        stockQuantity: 0,
      });
      setIsDrawerOpen(false);
      loadMaterials();
    } catch (error) {
      console.error("Erro ao cadastrar matéria-prima:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/material/${id}`);
      loadMaterials();
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
  };

  const handleUpdate = async (updatedMaterial: RawMaterialType) => {
    try {
      await api.put(`/material/${updatedMaterial.id}`, updatedMaterial);
      loadMaterials();
    } catch (error) {
      console.error("Erro ao atualizar:", error);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <AppSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-between p-6 w-full shrink-0 border-b bg-card/50">
          <ModeToggle />

          <Drawer
            open={isDrawerOpen}
            onOpenChange={setIsDrawerOpen}
            direction="right"
          >
            <DrawerTrigger asChild>
              <Button className="gap-2">
                <IconPlus size={18} /> Cadastrar Matéria-Prima
              </Button>
            </DrawerTrigger>
            <DrawerContent className="h-full sm:max-w-md ml-auto rounded-l-xl">
              <form onSubmit={handleCreate} className="flex flex-col h-full">
                <DrawerHeader>
                  <DrawerTitle>Nova Matéria-Prima</DrawerTitle>
                  <DrawerDescription>
                    Preencha os dados abaixo para adicionar ao estoque.
                  </DrawerDescription>
                </DrawerHeader>

                <div className="flex flex-col gap-5 px-6 overflow-y-auto">
                  <div className="grid gap-2">
                    <Label htmlFor="reg-name">Nome da Matéria-Prima</Label>
                    <Input
                      id="reg-name"
                      placeholder="Ex: Alumínio 6061"
                      value={newMaterial.name}
                      onChange={(e) =>
                        setNewMaterial({ ...newMaterial, name: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="reg-code">Código</Label>
                      <Input
                        id="reg-code"
                        placeholder="ALU-001"
                        value={newMaterial.code}
                        onChange={(e) =>
                          setNewMaterial({ ...newMaterial, code: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="reg-stock">Qtd. Inicial</Label>
                      <Input
                        id="reg-stock"
                        type="number"
                        value={newMaterial.stockQuantity}
                        onChange={(e) =>
                          setNewMaterial({
                            ...newMaterial,
                            stockQuantity: Number(e.target.value),
                          })
                        }
                        required
                      />
                    </div>
                  </div>
                </div>

                <DrawerFooter className="mt-auto border-t p-6">
                  <Button type="submit">Salvar Matéria-Prima</Button>
                  <DrawerClose asChild>
                    <Button variant="outline">Cancelar</Button>
                  </DrawerClose>
                </DrawerFooter>
              </form>
            </DrawerContent>
          </Drawer>
        </header>

        <div className="flex-1 w-full p-4 lg:p-6 overflow-hidden">
          <main className="w-full h-full flex flex-col">
            <DataTableRawMaterial
              data={materials}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          </main>
        </div>
      </div>
    </div>
  );
};