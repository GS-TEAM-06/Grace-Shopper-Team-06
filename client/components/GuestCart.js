import React, {Component} from "react";
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {
  fetchGuestCart,
  addToGuestCart,
  removeFromGuestCart,
  clearGuestCart,
} from "../GuestCart";

class GuestCart extends Component {
    constructor() {
        super();
        this.state = {

        }
    }

  render() {
    let guestCart = fetchGuestCart()
    let cards = guestCart.length ? (
        <div>
            {guestCart.map((card) => {
              return (
                <div key={guestCart.indexOf(card)}>
                  <li>
                    <div>
                      <img src={card.imgUrl} />
                    </div>
                    <Link to={`/cards/${card.id}`}>
                      <p>{card.name}</p>
                    </Link>
                    <p>{card.description}</p>
                    <p>{card.price}</p>
                    <button onClick={removeFromGuestCart()}>Remove</button>
                  </li>
                </div>
                );
            })}
            <div>
                <button onClick={clearGuestCart()}>Clear Cart</button>
            </div>
        </div>
      ) : (
        <p>Nothing</p>
      );

    return (
      <div>
        <h5>You have ordered:</h5>
        <ul>
            {cards}
        </ul>
      </div>
    );
  }
}

// const mapDispatch = (dispatch) => {
//   return {};
// };

export default GuestCart;
