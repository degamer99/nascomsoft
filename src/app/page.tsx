"use client"
import React, { useState, createContext, useContext } from 'react';
import { Button } from '@ui/button';
import { Input } from '@ui/input';
import { Badge } from '@ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@ui/card';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@ui/select';
import { Textarea } from '@ui/textarea';
import { Label } from '@ui/label';
import { ImageWithFallback } from '../components/figma/ImageWithFallback.tsx';
import { 
  ShoppingCart, 
  Search, 
  Grid, 
  List, 
  Plus, 
  Minus, 
  Settings, 
  Package,
  Star,
  Filter,
  Menu,
  X,
  Moon,
  Sun
} from 'lucide-react';

// Mock data for electronic components
const mockProducts = [
  {
    id: 1,
    name: "Arduino Uno R3",
    description: "Microcontroller board based on the ATmega328P",
    price: 25.99,
    category: "Microcontrollers",
    image: "https://images.unsplash.com/photo-1553406830-e2d8c7b3a3d7?w=400&h=300&fit=crop",
    stock: 45,
    rating: 4.8,
    specifications: {
      voltage: "5V",
      pins: "14 Digital I/O pins",
      memory: "32KB Flash"
    }
  },
  {
    id: 2,
    name: "Raspberry Pi 4 Model B",
    description: "Single-board computer with ARM Cortex-A72 processor",
    price: 89.99,
    category: "Single Board Computers",
    image: "https://images.unsplash.com/photo-1555617981-dac3880eac6e?w=400&h=300&fit=crop",
    stock: 23,
    rating: 4.9,
    specifications: {
      ram: "4GB LPDDR4",
      cpu: "Quad-core ARM Cortex-A72",
      connectivity: "Wi-Fi, Bluetooth, Gigabit Ethernet"
    }
  },
  {
    id: 3,
    name: "ESP32 Development Board",
    description: "Wi-Fi and Bluetooth enabled microcontroller",
    price: 15.99,
    category: "Microcontrollers",
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop",
    stock: 67,
    rating: 4.7,
    specifications: {
      wifi: "802.11 b/g/n",
      bluetooth: "Classic and BLE",
      cpu: "Dual-core Tensilica LX6"
    }
  },
  {
    id: 4,
    name: "Breadboard Kit",
    description: "Solderless breadboard with jumper wires",
    price: 12.99,
    category: "Prototyping",
    image: "https://images.unsplash.com/photo-1581092336111-8c69b0c47ab7?w=400&h=300&fit=crop",
    stock: 89,
    rating: 4.5,
    specifications: {
      points: "830 tie points",
      size: "165mm x 55mm",
      includes: "65 jumper wires"
    }
  },
  {
    id: 5,
    name: "LED Strip WS2812B",
    description: "Addressable RGB LED strip, 60 LEDs/meter",
    price: 19.99,
    category: "LEDs",
    image: "https://images.unsplash.com/photo-1581092786450-7c0b50c78c58?w=400&h=300&fit=crop",
    stock: 34,
    rating: 4.6,
    specifications: {
      leds: "60 LEDs per meter",
      voltage: "5V DC",
      power: "18W per meter"
    }
  },
  {
    id: 6,
    name: "Servo Motor SG90",
    description: "Micro servo motor for RC applications",
    price: 8.99,
    category: "Motors",
    image: "https://images.unsplash.com/photo-1581092918484-8313f0a12e6a?w=400&h=300&fit=crop",
    stock: 156,
    rating: 4.4,
    specifications: {
      torque: "1.8 kg/cm",
      speed: "0.1s/60°",
      voltage: "4.8V - 6V"
    }
  }
];

const categories = ["All", "Microcontrollers", "Single Board Computers", "Prototyping", "LEDs", "Motors", "Sensors"];

// Theme context for dark mode
const ThemeContext = createContext();

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
             (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme ? 'dark' : 'light');
      document.documentElement.classList.toggle('dark', newTheme);
    }
  };

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.classList.toggle('dark', isDark);
    }
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Context for cart management
const CartContext = createContext();

const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      getCartTotal,
      getCartItemCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

// Header Component
const Header = ({ searchQuery, setSearchQuery, viewMode, setViewMode }) => {
  const { getCartItemCount } = useCart();
  const { isDark, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-primary">NascomSoft</h1>
            <p className="text-muted-foreground hidden md:block">Electronic Components Store</p>
          </div>
          
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search components..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="p-2"
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            <CartSheet />
            
            <Button
              variant="outline"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search components..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

// Cart Sheet Component
const CartSheet = () => {
  const { cart, updateQuantity, removeFromCart, getCartTotal, getCartItemCount } = useCart();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          <ShoppingCart className="w-4 h-4" />
          {getCartItemCount() > 0 && (
            <Badge className="absolute -top-2 -right-2 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs">
              {getCartItemCount()}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
          <SheetDescription>
            {getCartItemCount()} item(s) in your cart
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          {cart.length === 0 ? (
            <p className="text-muted-foreground">Your cart is empty</p>
          ) : (
            <>
              {cart.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">${item.price}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="text-sm">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total: ${getCartTotal().toFixed(2)}</span>
                  <Button>Checkout</Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

// Product Card Component
const ProductCard = ({ product, viewMode }) => {
  const { addToCart } = useCart();

  if (viewMode === 'list') {
    return (
      <Card className="w-full">
        <div className="flex">
          <div className="w-48 h-32">
            <ImageWithFallback
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover rounded-l-lg"
            />
          </div>
          <div className="flex-1 p-6">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <CardDescription className="mt-2">{product.description}</CardDescription>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="secondary">{product.category}</Badge>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm ml-1">{product.rating}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">${product.price}</p>
                <p className="text-sm text-muted-foreground">{product.stock} in stock</p>
                <Button 
                  className="mt-2" 
                  onClick={() => addToCart(product)}
                  disabled={product.stock === 0}
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="p-0">
        <div className="aspect-square">
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover rounded-t-lg"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="text-xs">{product.category}</Badge>
          <div className="flex items-center">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs ml-1">{product.rating}</span>
          </div>
        </div>
        <CardTitle className="text-base">{product.name}</CardTitle>
        <CardDescription className="text-sm mt-1 line-clamp-2">{product.description}</CardDescription>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="w-full">
          <div className="flex justify-between items-center mb-3">
            <p className="text-lg font-bold">${product.price}</p>
            <p className="text-xs text-muted-foreground">{product.stock} in stock</p>
          </div>
          <Button 
            className="w-full" 
            onClick={() => addToCart(product)}
            disabled={product.stock === 0}
          >
            Add to Cart
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

// Product Detail Modal
const ProductDetailModal = ({ product, open, onOpenChange }) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{product.name}</DialogTitle>
          <DialogDescription>{product.description}</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <ImageWithFallback
              src={product.image}
              alt={product.name}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
          <div>
            <div className="space-y-4">
              <div>
                <Badge>{product.category}</Badge>
                <div className="flex items-center mt-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1">{product.rating} rating</span>
                </div>
              </div>
              <div>
                <h3>Specifications</h3>
                <div className="text-sm text-muted-foreground mt-2">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="capitalize">{key}:</span>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t pt-4">
                <p className="text-2xl font-bold">${product.price}</p>
                <p className="text-sm text-muted-foreground">{product.stock} in stock</p>
                <div className="flex items-center space-x-2 mt-4">
                  <Label htmlFor="quantity">Quantity:</Label>
                  <Select value={quantity.toString()} onValueChange={(v) => setQuantity(parseInt(v))}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(Math.min(10, product.stock))].map((_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                          {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    onClick={() => addToCart(product, quantity)}
                    disabled={product.stock === 0}
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Admin Panel Component
const AdminPanel = ({ products, setProducts }) => {
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    stock: '',
    specifications: {}
  });

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price) return;
    
    const product = {
      ...newProduct,
      id: Date.now(),
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock) || 0,
      rating: 4.5
    };
    
    setProducts([...products, product]);
    setNewProduct({
      name: '',
      description: '',
      price: '',
      category: '',
      image: '',
      stock: '',
      specifications: {}
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2>Add New Product</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
              placeholder="Arduino Uno R3"
            />
          </div>
          <div>
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              type="number"
              value={newProduct.price}
              onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
              placeholder="25.99"
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select onValueChange={(value) => setNewProduct({...newProduct, category: value})}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.slice(1).map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="stock">Stock Quantity</Label>
            <Input
              id="stock"
              type="number"
              value={newProduct.stock}
              onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
              placeholder="50"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={newProduct.description}
              onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
              placeholder="Product description..."
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              value={newProduct.image}
              onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
              placeholder="https://images.unsplash.com/..."
            />
          </div>
        </div>
        <Button onClick={handleAddProduct} className="mt-4">
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      <div>
        <h3>Existing Products</h3>
        <div className="space-y-2 mt-4">
          {products.map(product => (
            <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-muted-foreground">${product.price} • {product.stock} in stock</p>
              </div>
              <Badge>{product.category}</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Main App Component
export default function App() {
  const [products, setProducts] = useState(mockProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeTab, setActiveTab] = useState('shop');

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <ThemeProvider>
      <CartProvider>
        <div className="min-h-screen bg-background">
          <Header 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
          
          <main className="container mx-auto px-4 py-8">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 max-w-md">
                <TabsTrigger value="shop">Shop</TabsTrigger>
                <TabsTrigger value="admin">
                  <Settings className="w-4 h-4 mr-2" />
                  Admin
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="shop" className="mt-8">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Filters Sidebar */}
                  <div className="lg:w-64">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Filter className="w-4 h-4 mr-2" />
                          Filters
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <Label>Category</Label>
                            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                              <SelectTrigger className="mt-2">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map(category => (
                                  <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Products Grid */}
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-6">
                      <p className="text-muted-foreground">
                        {filteredProducts.length} product(s) found
                      </p>
                      <div className="flex items-center space-x-2 lg:hidden">
                        <Button
                          variant={viewMode === 'grid' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setViewMode('grid')}
                        >
                          <Grid className="w-4 h-4" />
                        </Button>
                        <Button
                          variant={viewMode === 'list' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setViewMode('list')}
                        >
                          <List className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className={viewMode === 'grid' 
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" 
                      : "space-y-4"
                    }>
                      {filteredProducts.map(product => (
                        <div key={product.id} onClick={() => setSelectedProduct(product)} className="cursor-pointer">
                          <ProductCard product={product} viewMode={viewMode} />
                        </div>
                      ))}
                    </div>

                    {filteredProducts.length === 0 && (
                      <div className="text-center py-12">
                        <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">No products found matching your criteria.</p>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="admin" className="mt-8">
                <AdminPanel products={products} setProducts={setProducts} />
              </TabsContent>
            </Tabs>
          </main>

          {/* Product Detail Modal */}
          {selectedProduct && (
            <ProductDetailModal
              product={selectedProduct}
              open={!!selectedProduct}
              onOpenChange={(open) => !open && setSelectedProduct(null)}
            />
          )}
        </div>
      </CartProvider>
    </ThemeProvider>
  );
}
