import React, { Component } from "react";


class GuestCheckout extends Component {
  constructor(){
    super();
    this.state = {
      guestCart: []
    }
  }
  render(){
    console.log("Guest Cart->", JSON.parse(localStorage.getItem("guestCart")))
    let guestCart = JSON.parse(localStorage.getItem("guestCart"))

    let cards = guestCart.length ? (
      <div>
        {guestCart.map((card) => {
          return (
            <div key={guestCart.indexOf(card)}>
                <li>{card.name}</li>
                <p>Quantity: {card.quantity}</p>
            </div>
          );
        })}
      </div>
    ) : (
      <p>This cart is empty</p>
    );


    return (
    <div>
      <ul>{cards}</ul>
      <div>Payment</div>
      <h3>Order Summary</h3>
      <p>Total: ${(guestCart.reduce((accum, curr) => accum + (curr.price * curr.quantity), 0)/100).toFixed(2)}</p>
      <p>
        <button>Place your order</button>
      </p>
    </div>
    )}
}

export default GuestCheckout
