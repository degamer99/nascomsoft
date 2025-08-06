"use client"
import React, { useState, useEffect } from 'react';
import Image from "next/image"
import { create } from 'zustand';
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter 
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Mock data for the products to display (as provided by the user)
const mockProducts_Later = [
  { name: "Accessories",
    items: [
      {id: 1,name: "20w hot glue stick",reviews: "(0)",price: "₦270.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 2,name: "Male-male jumper wire (single)",reviews: "(0)",price: "₦100.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 3,name: "Male-female jumper wire (single)",reviews: "(0)",price: "₦100.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 4,name: "Male-female jumper wire (set)",reviews: "(0)",price: "₦1,500.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 5,name: "Hot glue sticks-60w",reviews: "(0)",price: "₦400.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 6,name: "Neodymium super magnet 8x5mm",reviews: "(0)",price: "₦350.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 7,name: "Female-female jumper wire (single)",reviews: "(0)",price: "₦100.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 8,name: "Female-female jumper wire (set)",reviews: "(0)",price: "₦1,400.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 9,name: "Tact switch 12*12*6",reviews: "(0)",price: "₦100.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9}
    ]
  },
  { name: "Modules",
    items: [
      {id: 10,name: "HC-SR04 UltraSonic Sensor",reviews: "(0)",price: "₦2,500.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 11,name: "Blue LCD 1602",reviews: "(0)",price: "₦3,000.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 12,name: "PIR motion sensor",reviews: "(0)",price: "₦2,000.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 13,name: "Relay module 1 channel",reviews: "(0)",price: "₦1,400.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 14,name: "LM2596 Buck DC-DC power module",reviews: "(0)",price: "₦2,000.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 15,name: "sim800L GSM module",reviews: "(0)",price: "₦8,800.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 16,name: "DHT11 Temperature and humidity sensor",reviews: "(0)",price: "₦1,700.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 17,name: "L298N Dual H Bridge DC Stepper Motor Driver",reviews: "(0)",price: "₦5,500.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
      {id: 18,name: "HC-05 bluetooth Module",reviews: "(0)",price: "₦6,000.00",imageUrl: "https://placehold.co/150x100/E0E0E0/white?text=Product",quantity: 9},
    ]
  }
];

// Flatten the mock data for easier management
const initialProducts = mockProducts_Later.flatMap(category =>
  category.items.map(item => ({
    ...item,
    // Ensure IDs are unique across all categories if they weren't already
    // For this example, I've manually adjusted IDs in mockProducts_Later to be unique
  }))
);


// cartStore.ts (Modified to include product CRUD)
interface Product {
  id: number | string; // Allow string for new products using UUID
  name: string;
  reviews: string;
  price: string; // in format like "₦2,500.00"
  imageUrl: string;
  quantity: number; // stock quantity
}

interface CartItem {
  id: number | string;
  name: string;
  reviews: string;
  price: string;
  imageUrl: string;
  quantity: number; // number in cart
}

interface CartStore {
  items: CartItem[];
  products: Product[]; // Now managed by the store
  
  // Cart actions
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number | string) => void;
  updateQuantity: (productId: number | string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;

  // Product management actions
  setProducts: (products: Product[]) => void; // To initialize products
  addProduct: (product: Omit<Product, 'id'>) => void; // Omit id as it will be generated
  updateProduct: (productId: number | string, updatedProduct: Partial<Product>) => void;
  deleteProduct: (productId: number | string) => void;
}

// export const useCartStore = create<CartStore>((set, get) => ({
const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  products: [], // Initialize empty, will be set by component

  // Cart actions (unchanged)
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

  // Product management actions
  setProducts: (products) => set({ products }),

  addProduct: (newProductData) => {
    const newId = Date.now(); // Simple ID generation, use UUID in real app
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
}));


// Main Product Management Component
const App = () => {
  const { products, setProducts, addProduct, updateProduct, deleteProduct } = useCartStore();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [currentProduct, setCurrentProduct] = useState<Product | null>(null)

  // Form state for adding/editing products
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    imageUrl: '',
    quantity: 0,
    reviews: '(0)', // Default reviews
  });

  useEffect(() => {
    // Initialize products in the store when the component mounts
    setProducts(initialProducts);
  }, [setProducts]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
    }));
  };

  const handleAddProduct = () => {
    addProduct(formData);
    setIsAddDialogOpen(false);
    setFormData({ name: '', price: '', imageUrl: '', quantity: 0, reviews: '(0)' }); // Reset form
  };

  const handleEditProduct = () => {
    if (currentProduct) {
      updateProduct(currentProduct.id, formData);
      setIsEditDialogOpen(false);
      setFormData({ name: '', price: '', imageUrl: '', quantity: 0, reviews: '(0)' }); // Reset form
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
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (product: Product) => {
    setCurrentProduct(product);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans flex flex-col items-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Product Management</h1>

        <div className="mb-4 flex justify-end">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add New Product</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>
                  Fill in the details for the new product.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">Name</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleInputChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="price" className="text-right">Price</Label>
                  <Input id="price" name="price" value={formData.price} onChange={handleInputChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="imageUrl" className="text-right">Image URL</Label>
                  <Input id="imageUrl" name="imageUrl" value={formData.imageUrl} onChange={handleInputChange} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="quantity" className="text-right">Quantity</Label>
                  <Input id="quantity" name="quantity" type="number" value={formData.quantity} onChange={handleInputChange} className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddProduct}>Add Product</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Product Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                  No products available. Add some!
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Image src={product.imageUrl} alt={product.name} height={80} width={100} className="w-12 h-12 object-contain rounded-md" />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.price}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(product)}>
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => openDeleteDialog(product)}>
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Edit Product Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
              <DialogDescription>
                Make changes to the product details.
              </DialogDescription>
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
                <Label htmlFor="edit-imageUrl" className="text-right">Image URL</Label>
                <Input id="edit-imageUrl" name="imageUrl" value={formData.imageUrl} onChange={handleInputChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-quantity" className="text-right">Quantity</Label>
                <Input id="edit-quantity" name="quantity" type="number" value={formData.quantity} onChange={handleInputChange} className="col-span-3" />
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
    </div>
  );
};

export default App;
