/* eslint-disable react-hooks/set-state-in-effect */
import { AppSidebar } from "@/components/app-sidebar";
import { DataTableProducts } from "@/components/data-table_products";
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

type ProductType = {
  id: string;
  code: string;
  name: string;
  value: number;
};

export const RegisterProduct = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [newProduct, setNewProduct] = useState({
    code: "",
    name: "",
    value: 0,
    rawMaterialQuantity: 0,
    rawMaterialId: "",
  });

  const loadProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = { ...newProduct };
      await api.post(`/products/${newProduct.rawMaterialId}`, payload);

      setNewProduct({
        code: "",
        name: "",
        value: 0,
        rawMaterialQuantity: 0,
        rawMaterialId: "",
      });
      setIsDrawerOpen(false);
      loadProducts();
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/products/${id}`);
      loadProducts();
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
    }
  };

  const handleUpdate = async (updatedProduct: ProductType) => {
    try {
      await api.put(`/products/${updatedProduct.id}`, updatedProduct);
      loadProducts();
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
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
                <IconPlus size={18} /> Cadastrar Produto
              </Button>
            </DrawerTrigger>
            <DrawerContent className="h-full sm:max-w-md ml-auto rounded-l-xl">
              <form onSubmit={handleCreate} className="flex flex-col h-full">
                <DrawerHeader>
                  <DrawerTitle>Novo Produto</DrawerTitle>
                  <DrawerDescription>
                    Insira as informações para registrar o produto no sistema.
                  </DrawerDescription>
                </DrawerHeader>

                <div className="flex flex-col gap-5 px-6 overflow-y-auto">
                  <div className="grid gap-2">
                    <Label htmlFor="reg-name">Nome do Produto</Label>
                    <Input
                      id="reg-name"
                      value={newProduct.name}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, name: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="reg-code">Código</Label>
                      <Input
                        id="reg-code"
                        value={newProduct.code}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, code: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="reg-value">Preço Unitário</Label>
                      <Input
                        id="reg-value"
                        type="number"
                        step="0.01"
                        value={newProduct.value}
                        onChange={(e) =>
                          setNewProduct({
                            ...newProduct,
                            value: Number(e.target.value),
                          })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="reg-raw-id">ID da Matéria-Prima</Label>
                    <Input
                      id="reg-raw-id"
                      placeholder="Ex: 3fa85f64-5717-4562-b3fc..."
                      value={newProduct.rawMaterialId}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          rawMaterialId: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="reg-raw">Quantidade de Matéria Prima</Label>
                    <Input
                      id="reg-raw"
                      type="number"
                      value={newProduct.rawMaterialQuantity}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          rawMaterialQuantity: Number(e.target.value),
                        })
                      }
                      required
                    />
                  </div>
                </div>

                <DrawerFooter className="mt-auto border-t p-6">
                  <Button type="submit">Confirmar Cadastro</Button>
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
            <DataTableProducts
              data={products}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          </main>
        </div>
      </div>
    </div>
  );
};