import { useState } from "react";
import { useQuery } from "react-query";
// Components
import Item from "./Item/Item";
import Cart from "./Cart/Cart";
import Drawer from "@material-ui/core/Drawer";
import LinearProgress from "@material-ui/core/LinearProgress";
import Grid from "@material-ui/core/Grid";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import Badge from "@material-ui/core/Badge";
// Styles
import { Wrapper, StyledButton } from "./App.styles";
// Types
import { CartItemType } from "./CartItem/CartItemType";

const getProducts = async (): Promise<CartItemType[]> =>
  await (await fetch("http://localhost:3070/api/items")).json();

const App = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const localCart = localStorage.getItem("cart");
  const items = localCart ? JSON.parse(localCart) : [];
  const [cartItems, setCartItems] = useState(items as CartItemType[]);
  const { data, isLoading, error } = useQuery<CartItemType[]>(
    "products",
    getProducts
  );

  const getTotalItems = (items: CartItemType[]) =>
    items.reduce((ack: number, item) => ack + item.quantity, 0);
  const handleAddToCart = (clickedItem: CartItemType) => {
    setCartItems((prev) => {
      // 1. Is the item already added in the cart?
      const isItemInCart = prev.find((item) => item._id === clickedItem._id);
      let cart;
      if (isItemInCart) {
        cart = prev.map((item) =>
          item._id === clickedItem._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        // First time the item is added
        cart = [...prev, { ...clickedItem, quantity: 1 }];
      }
      localStorage.setItem("cart", JSON.stringify(cart));
      return cart;
    });
  };

  const handleRemoveFromCart = (id: string) => {
    setCartItems((prev) => {
      const cart = prev.reduce((ack, item) => {
        if (item._id === id) {
          if (item.quantity === 1) return ack;
          return [...ack, { ...item, quantity: item.quantity - 1 }];
        } else {
          return [...ack, item];
        }
      }, [] as CartItemType[]);
      localStorage.setItem("cart", JSON.stringify(cart));
      return cart;
    });
  };

  if (isLoading) return <LinearProgress />;
  if (error) return <div>Something went wrong ...</div>;

  return (
    <Wrapper>
      <Drawer anchor="right" open={cartOpen} onClose={() => setCartOpen(false)}>
        <Cart
          cartItems={cartItems}
          addToCart={handleAddToCart}
          removeFromCart={handleRemoveFromCart}
        />
      </Drawer>
      <StyledButton onClick={() => setCartOpen(true)}>
        <Badge badgeContent={getTotalItems(cartItems)} color="error">
          <AddShoppingCartIcon />
        </Badge>
      </StyledButton>
      <Grid container spacing={3}>
        {data?.map((item) => (
          <Grid item key={item._id} xs={12} sm={3}>
            <Item item={item} handleAddToCart={handleAddToCart} />
          </Grid>
        ))}
      </Grid>
    </Wrapper>
  );
};

export default App;
