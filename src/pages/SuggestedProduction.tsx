"use client";
import { AppSidebar } from "@/components/app-sidebar";
import { DataTable } from "@/components/data-table";
import { ModeToggle } from "@/components/mode-toggle";
import api from "@/connection/api";
import { useEffect, useState } from "react";

export default function SuggestedProduction() {
  type ProductSuggest = {
    code: string;
    product_name: string;
    quantity: number;
    total_value: string;
    unit_price: number;
  };

  const [products, setProducts] = useState<ProductSuggest[]>([]);

  useEffect(() => {
    const loadProduction = async () => {
      try {
        const response = await api.get("/production");
        setProducts(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    loadProduction();
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto overflow-x-hidden">
        <header className="flex items-center justify-between p-6 w-full shrink-0">
          <ModeToggle />
        </header>

        <div className="flex justify-center w-full p-6">
          <main className="w-full max-w-7xl">
            <DataTable data={products} />
          </main>
        </div>
      </div>
    </div>
  );
}
