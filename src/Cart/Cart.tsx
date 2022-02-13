import CartItem from "../CartItem/CartItem";
import { Wrapper, StyledCartList } from "./Cart.styles";
import { CartItemType } from "../CartItem/CartItemType";
type Props = {
  cartItems: CartItemType[];
  addToCart: (clickedItem: CartItemType) => void;
  removeFromCart: (id: string) => void;
};

// const coupons = [
//   {

//   },
//   {

//   }
// ]

const Cart: React.FC<Props> = ({ cartItems, addToCart, removeFromCart }) => {
  const calculateTotal = (items: CartItemType[]) =>
    items.reduce((ack: number, item) => ack + item.quantity * item.price, 0);
  return (
    <Wrapper>
      <h2>Your Shopping Cart</h2>
      <StyledCartList>
        {cartItems.length === 0 ? <p>No items in cart.</p> : null}
        {cartItems.map((item) => (
          <CartItem
            key={item._id}
            item={item}
            addToCart={addToCart}
            removeFromCart={removeFromCart}
          />
        ))}
      </StyledCartList>
      <h2>Total: ${calculateTotal(cartItems).toFixed(2)}</h2>
    </Wrapper>
  );
};

export default Cart;
