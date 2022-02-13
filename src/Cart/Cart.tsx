import CartItem from "../CartItem/CartItem";
import { useState } from "react";
import { useQuery } from "react-query";
import { Wrapper, StyledCartList } from "./Cart.styles";
import { CartItemType } from "../CartItem/CartItemType";
import Coupon from "../Coupon/Coupon";
import { CouponData } from "../Coupon/CouponData";
import { Grid, Button } from "@material-ui/core";
type Props = {
  cartItems: CartItemType[];
  addToCart: (clickedItem: CartItemType) => void;
  removeFromCart: (id: string) => void;
};

const Cart: React.FC<Props> = ({ cartItems, addToCart, removeFromCart }) => {
  const getCoupons = async (): Promise<CouponData[]> =>
    await (await fetch("http://localhost:3070/api/coupons")).json();

  const { data, isLoading, error } = useQuery<CouponData[]>(
    "coupons",
    getCoupons
  );

  const initialCoupon = {
    _id: "",
    title: "",
    code: "",
    type: "",
    applyOn: "",
    minQty: 0,
    minOrder: 0,
    value: 0,
  };

  const [applyCoupon, setApplyCoupon] = useState(initialCoupon);
  const [applied, setApplied] = useState("");

  const handleApplyCoupon = (coupon: CouponData) => {
    setApplyCoupon(coupon);
    setApplied(coupon._id);
  };

  const handleRemoveCoupon = () => {
    setApplyCoupon(initialCoupon);
    setApplied("");
  };

  const calculateTotal = (items: CartItemType[]) => {
    const total = items.reduce(
      (ack: number, item) => ack + item.quantity * item.price,
      0
    );

    let discount = 0;

    if (applyCoupon.applyOn === "product") {
      items.forEach((item) => {
        if (applyCoupon.minQty && item.quantity >= applyCoupon.minQty) {
          if (applyCoupon.type === "fixed") {
            discount += applyCoupon.value * item.quantity;
          } else {
            discount += (applyCoupon.value * item.quantity * item.price) / 100;
          }
        }
      });
    } else if (
      applyCoupon.applyOn === "order" &&
      total >= applyCoupon.minOrder
    ) {
      if (applyCoupon.type === "fixed") {
        discount = applyCoupon.value;
      } else {
        discount = (applyCoupon.value * total) / 100;
      }
    }
    return {
      discount: discount,
      subTotal: total,
      total: total - discount,
    };
  };

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
      <Grid container spacing={3}>
        {data?.map((item: CouponData) => (
          <Grid item key={item._id} xs={12} sm={12}>
            <Coupon
              coupon={item}
              apply={handleApplyCoupon}
              remove={handleRemoveCoupon}
              applied={applied}
            />
          </Grid>
        ))}
      </Grid>
      <Grid>
        <p>Subtotal: ${calculateTotal(cartItems).subTotal.toFixed(2)}</p>
        {calculateTotal(cartItems).discount ? (
          <p>Discount: ${calculateTotal(cartItems).discount.toFixed(2)}</p>
        ) : (
          ""
        )}
        <h2>Total: ${calculateTotal(cartItems).total.toFixed(2)}</h2>
        <Button variant="contained">Checkout</Button>
      </Grid>
    </Wrapper>
  );
};

export default Cart;
