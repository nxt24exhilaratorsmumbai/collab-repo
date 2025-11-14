"use client";
import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState({}); // { [productId]: quantity }

    const addToCart = (product) => {
        if (!product.id) return; // safeguard
        setCartItems((prev) => ({
            ...prev,
            [product.id]: (prev[product.id] || 0) + 1,
        }));
    };

    const removeFromCart = (product) => {
        if (!product.id) return;
        setCartItems((prev) => {
            const newCart = { ...prev };
            if (newCart[product.id] > 1) newCart[product.id] -= 1;
            else delete newCart[product.id];
            return newCart;
        });
    };

    const getProductCount = (productId) => cartItems[productId] || 0;
    const cartCount = Object.values(cartItems).reduce((a, b) => a + b, 0);

    return (
        <CartContext.Provider
            value={{ cartItems, cartCount, addToCart, removeFromCart, getProductCount }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}
