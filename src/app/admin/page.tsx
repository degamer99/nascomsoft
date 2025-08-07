"use client"
// at the top of src/app/admin/page.tsx
import React, { useState, useEffect, ChangeEvent } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent,

DialogHeader ,
DialogTitle ,
DialogDescription,
DialogFooter,
DialogTrigger ,

} from "@/components/ui/dialog"




export interface Product {
    id: string; // Changed to string for nanoid
    name: string;
    reviews: string;
    price: string;
    imageUrl: string;
    quantity: number;
    category: string;
    description: string;
}
interface CartItem extends Product {
    quantity: number;
}
interface CartStore {
    items: CartItem[];
    products: Product[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    getTotalItems: () => number;
    getTotalPrice: () => number;
    setProducts: (products: Product[]) => void;
    addProduct: (newProductData: Omit<Product, 'id'>) => void;
    updateProduct: (productId: string, updatedProductData: Partial<Product>) => void;
    deleteProduct: (productId: string) => void;
}

const mockProductsData = [
  { name: "Microcontrollers",
    items: [
      {id: nanoid(), name: "Arduino Uno R3", reviews: "(0)", price: "₦2,500.00", imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product", quantity: 45, category: "Microcontrollers", description: "Microcontroller board based on the ATmega328P."},
      {id: nanoid(), name: "ESP32 Development Board", reviews: "(0)", price: "₦3,000.00", imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product", quantity: 67, category: "Microcontrollers", description: "Wi-Fi and Bluetooth enabled microcontroller."},
      {id: nanoid(), name: "Raspberry Pi Pico", reviews: "(0)", price: "₦1,500.00", imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product", quantity: 20, category: "Microcontrollers", description: "A low-cost, high-performance microcontroller board."},
    ]
  },
  { name: "Single Board Computers",
    items: [
      {id: nanoid(), name: "Raspberry Pi 4 Model B", reviews: "(0)", price: "₦8,800.00", imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product", quantity: 23, category: "Single Board Computers", description: "Single-board computer with ARM Cortex-A72 processor."},
      {id: nanoid(), name: "Jetson Nano Developer Kit", reviews: "(0)", price: "₦15,000.00", imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product", quantity: 15, category: "Single Board Computers", description: "A small, powerful computer for AI and robotics."},
    ]
  },
];


const initialProducts = mockProductsData.flatMap(category =>
  category.items.map(item => ({
    ...item
  }))
);

const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      products: [],
      
      addToCart: (product) => {
        const { items } = get();
        const existing = items.find((item) => item.id === product.id);
        if (existing) {
          set({
            items: items.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({ items: [...items, { ...product, quantity: 1 }] });
        }
      },
      removeFromCart: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        set((state) => ({
          items: state.items.map((item) =>
            item.id === productId ? { ...item, quantity } : item
          ),
        }));
      },
      clearCart: () => set({ items: [] }),
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const price = parseFloat(item.price.replace(/[^\d.-]/g, "").replace(",", ""));
          return total + price * item.quantity;
        }, 0);
      },
      setProducts: (products) => set({ products }),
      addProduct: (newProductData) => {
        const newId = nanoid();
        const newProduct: Product = { ...newProductData, id: newId, reviews: newProductData.reviews || "(0)" };
        set((state) => ({
          products: [...state.products, newProduct],
        }));
      },
      updateProduct: (productId, updatedProductData) => {
        set((state) => ({
          products: state.products.map((product) =>
            product.id === productId ? { ...product, ...updatedProductData } : product
          ),
        }));
      },
      deleteProduct: (productId) => {
        set((state) => ({
          products: state.products.filter((product) => product.id !== productId),
        }));
      },
    }),
    { name: 'cart-storage' }
  )
);

const App = () => {
  const { products, setProducts, addProduct, updateProduct, deleteProduct } = useCartStore();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    imageUrl: '',
    quantity: 0,
    reviews: '(0)',
    category: '',
    description: '',
  });

  useEffect(() => {
    setProducts(initialProducts);
  }, [setProducts]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ): void => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
    }));
  };

  const handleAddProduct = () => {
    addProduct(formData);
    setIsAddDialogOpen(false);
    setFormData({ name: '', price: '', imageUrl: '', quantity: 0, reviews: '(0)', category: '', description: '' });
  };

  const handleEditProduct = () => {
    if (currentProduct) {
      updateProduct(currentProduct.id, formData);
      setIsEditDialogOpen(false);
      setFormData({ name: '', price: '', imageUrl: '', quantity: 0, reviews: '(0)', category: '', description: '' });
      setCurrentProduct(null);
    }
  };

  const handleDeleteProduct = () => {
    if (currentProduct) {
      deleteProduct(currentProduct.id);
      setIsDeleteDialogOpen(false);
      setCurrentProduct(null);
    }
  };

  const openEditDialog = (product: Product) => {
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: product.quantity,
      reviews: product.reviews,
      category: product.category,
      description: product.description,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (product: Product) => {
    setCurrentProduct(product);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0E1521] text-gray-200 font-sans p-8">
      {/* Navbar - based on other Figma images */}
      <nav className="flex items-center justify-between p-4 mb-8 bg-[#18202D] rounded-xl shadow-lg">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-teal-400">NascomSoft</h1>
          <div className="flex space-x-2 ml-8 text-sm font-medium">
            <button className="px-4 py-2 rounded-lg text-gray-400 hover:text-white transition-colors">Shop</button>
            <button className="px-4 py-2 rounded-lg bg-teal-600 text-white shadow-md">Admin</button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-white">Add New Product</h2>
        <div className="bg-[#18202D] rounded-xl shadow-lg p-6 mb-8 grid grid-cols-2 gap-x-8 gap-y-4">
          <div className="space-y-2">
            <Label htmlFor="product-name">Product Name</Label>
            <Input id="product-name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Arduino Uno R3" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price ($)</Label>
            <Input id="price" name="price" value={formData.price} onChange={handleInputChange} placeholder="25.99" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <div className="relative">
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="block appearance-none w-full bg-gray-800 border border-gray-700 text-gray-300 py-2.5 px-3 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="" disabled>Select category</option>
                <option value="Microcontrollers">Microcontrollers</option>
                <option value="Single Board Computers">Single Board Computers</option>
                <option value="Accessories">Accessories</option>
                <option value="Modules">Modules</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9z"/></svg>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="stock">Stock Quantity</Label>
            <Input id="stock" name="quantity" type="number" value={formData.quantity} onChange={handleInputChange} placeholder="50" />
          </div>
          <div className="space-y-2 col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" value={formData.description} onChange={handleInputChange} placeholder="Product description..." />
          </div>
          <div className="space-y-2 col-span-2">
            <Label htmlFor="image-url">Image URL</Label>
            <Input id="image-url" name="imageUrl" value={formData.imageUrl} onChange={handleInputChange} placeholder="https://images.unsplash.com/..." />
          </div>
          <div className="col-span-2 flex justify-end">
            <Button onClick={handleAddProduct}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
              Add Product
            </Button>
          </div>
        </div>

        <h2 className="text-2xl font-bold mb-4 text-white">Existing Products</h2>
        <div className="bg-[#18202D] rounded-xl shadow-lg p-6">
          <div className="space-y-4">
            {products.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No products available. Add some using the form above!
              </div>
            ) : (
              products.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-4 bg-[#232E3F] rounded-lg">
                  <div className="flex flex-col">
                    <span className="font-bold text-lg">{product.name}</span>
                    <span className="text-gray-400 text-sm">{product.price} • {product.quantity} in stock</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="bg-teal-600 text-white text-xs px-2 py-1 rounded-full">{product.category}</span>
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(product)}>Edit</Button>
                    <Button variant="destructive" size="sm" onClick={() => openDeleteDialog(product)}>Delete</Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Make changes to the product details.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">Name</Label>
              <Input id="edit-name" name="name" value={formData.name} onChange={handleInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-price" className="text-right">Price</Label>
              <Input id="edit-price" name="price" value={formData.price} onChange={handleInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-category" className="text-right">Category</Label>
              <select
                id="edit-category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="col-span-3 block appearance-none w-full bg-gray-800 border border-gray-700 text-gray-300 py-2.5 px-3 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="Microcontrollers">Microcontrollers</option>
                <option value="Single Board Computers">Single Board Computers</option>
                <option value="Accessories">Accessories</option>
                <option value="Modules">Modules</option>
              </select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-stock" className="text-right">Stock</Label>
              <Input id="edit-stock" name="quantity" type="number" value={formData.quantity} onChange={handleInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-description" className="text-right">Description</Label>
              <Textarea id="edit-description" name="description" value={formData.description} onChange={handleInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-imageUrl" className="text-right">Image URL</Label>
              <Input id="edit-imageUrl" name="imageUrl" value={formData.imageUrl} onChange={handleInputChange} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditProduct}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Product Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{currentProduct?.name}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteProduct}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default App;
