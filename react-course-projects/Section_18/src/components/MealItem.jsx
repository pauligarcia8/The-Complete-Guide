import { useContext } from "react";
import Button from "../UI/Button";
import { currencyFormatter } from "../util/formatting";
import CartContext from "../store/CartContext";

export default function MealItem({ meal }) {
  const cartCtx = useContext(CartContext);

  function handleMealToCart() {
    cartCtx.addItem(meal);
  }
  
  return (
    <li className="meal-item">
      <article>
        <img src={`http://localhost:3000/${meal.image}`} alt={meal.name} />
        <div>
          <h3>{meal.name}</h3>
          <p className="meal-item-price">
            {currencyFormatter.format(meal.price)}
          </p>
          <p className="meal-item-actions">{meal.description}</p>
        </div>
        <p className="meal-iten-actions">
          <Button onClick={handleMealToCart}>Add to Cart</Button>
        </p>
      </article>
    </li>
  );
}
