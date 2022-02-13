import Button from "@material-ui/core/Button";
// Types
import { CouponData } from "./CouponData";
// Styles
import { StyledCoupon } from "./Coupon.styles";

type Props = {
  coupon: CouponData;
  apply: (clickedCoupon: CouponData) => void;
  remove: (id: string) => void;
  applied: string;
};

const Coupon: React.FC<Props> = ({ coupon, apply, remove, applied }) => (
  <StyledCoupon>
    <div className="information">
      <p>
        {coupon.title} (<b>{coupon.code}</b>)
        {applied === coupon._id ? (
          <Button
            style={{ float: "right" }}
            size="small"
            disableElevation
            variant="contained"
            onClick={() => remove(coupon._id)}
          >
            REMOVE
          </Button>
        ) : (
          <Button
            style={{ float: "right" }}
            size="small"
            disableElevation
            variant="contained"
            onClick={() => apply(coupon)}
          >
            APPLY
          </Button>
        )}
      </p>
    </div>
  </StyledCoupon>
);

export default Coupon;
