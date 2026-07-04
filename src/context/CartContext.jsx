import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart deve ser usado dentro de CartProvider');
  }
  return context;
}

function loadCartFromStorage() {
  try {
    const saved = localStorage.getItem('carrinho');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(loadCartFromStorage);

  useEffect(() => {
    localStorage.setItem('carrinho', JSON.stringify(cartItems));
  }, [cartItems]);

  function addToCart(produto) {
    setCartItems(prev => {
      const existing = prev.find(item => item.produto.id === produto.id);
      if (existing) {
        if (existing.quantidade >= produto.estoque) return prev;
        return prev.map(item =>
          item.produto.id === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      }
      if (produto.estoque <= 0) return prev;
      return [...prev, { produto, quantidade: 1 }];
    });
  }

  function removeFromCart(produtoId) {
    setCartItems(prev => prev.filter(item => item.produto.id !== produtoId));
  }

  function increaseQty(produtoId) {
    setCartItems(prev =>
      prev.map(item => {
        if (item.produto.id === produtoId) {
          if (item.quantidade >= item.produto.estoque) return item;
          return { ...item, quantidade: item.quantidade + 1 };
        }
        return item;
      })
    );
  }

  function decreaseQty(produtoId) {
    setCartItems(prev =>
      prev.map(item => {
        if (item.produto.id === produtoId) {
          if (item.quantidade <= 1) return item;
          return { ...item, quantidade: item.quantidade - 1 };
        }
        return item;
      })
    );
  }

  function getItemQty(produtoId) {
    const item = cartItems.find(item => item.produto.id === produtoId);
    return item ? item.quantidade : 0;
  }

  function getTotal() {
    return cartItems.reduce(
      (total, item) => total + item.produto.preco * item.quantidade,
      0
    );
  }

  function clearCart() {
    setCartItems([]);
  }

  function getCartCount() {
    return cartItems.reduce((count, item) => count + item.quantidade, 0);
  }

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    increaseQty,
    decreaseQty,
    getItemQty,
    getTotal,
    clearCart,
    getCartCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
