import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

class GuestCart extends Component {
  constructor() {
    super();
    this.state = {
      guestCart: [],
    };
    this.fetchGuestCart = this.fetchGuestCart.bind(this);
    this.removeFromGuestCart = this.removeFromGuestCart.bind(this);
    this.clearGuestCart = this.clearGuestCart.bind(this);
    this.addToGuestCart = this.addToGuestCart.bind(this);
    this.subtractQuantity = this.subtractQuantity.bind(this);
  }

  fetchGuestCart() {
    const guestCart = JSON.parse(localStorage.getItem("guestCart"));
    return guestCart;
  }

  async addToGuestCart(evt) {
    const { data } = await axios.get(`/api/cards/${evt.target.value}`);
    let guestCart = JSON.parse(localStorage.getItem("guestCart"));
    let guestCartId = guestCart.map((card) => card.id);
    let index = guestCartId.indexOf(data.id);
    if (index === -1) {
      data.quantity = 1;
      guestCart.push(data);
    } else {
      guestCart[index].quantity += 1;
    }
    localStorage.guestCart = JSON.stringify(guestCart);
    this.setState({
      guestCart: guestCart,
    });
  }

  subtractQuantity(evt) {
    // const { data } = await axios.get(`/api/cards/${evt.target.value}`);
    let guestCart = JSON.parse(localStorage.getItem("guestCart"));
    let guestCartId = guestCart.map((card) => card.id);
    let index = guestCartId.indexOf(Number(evt.target.value));
    console.log("guestCart[index] ->", index);
    if (guestCart[index].quantity === 1) {
      this.removeFromGuestCart(evt);
    } else {
      guestCart[index].quantity -= 1;
    }
    localStorage.guestCart = JSON.stringify(guestCart);
    this.setState({
      guestCart: guestCart,
    });
  }

  async removeFromGuestCart(evt) {
    const { data: card } = await axios.get(`/api/cards/${evt.target.value}`);
    let guestCart = JSON.parse(localStorage.getItem("guestCart"));
    let guestCartId = guestCart.map((card) => card.id);
    let index = guestCartId.indexOf(card.id);
    guestCart.splice(index, 1);
    localStorage.guestCart = JSON.stringify(guestCart);
    this.setState({
      guestCart: guestCart,
    });
  }

  clearGuestCart() {
    this.setState({
      guestCart: [],
    });
    localStorage.guestCart = JSON.stringify(this.state.guestCart);
  }

  render() {
    console.log("guest cart state --> ", this.state);
    let guestCart = this.fetchGuestCart();
    let cards = guestCart.length ? (
      <div>
        {guestCart.map((card) => {
          return (
            <div key={guestCart.indexOf(card)}>
              <div>{/* <img src={card.imageUrl} /> */}</div>
              <Link to={`/cards/${card.id}`}>
                <p>{card.name}</p>
              </Link>
              <p>{card.description}</p>
              <p>{card.price}</p>
              <p>Quantity: {card.quantity}</p>

              <button value={card.id} onClick={this.addToGuestCart}>
                +
              </button>
              <button value={card.id} onClick={this.subtractQuantity}>
                -
              </button>
              <button value={card.id} onClick={this.removeFromGuestCart}>
                Remove
              </button>
            </div>
          );
        })}
        <div>
          <button onClick={this.clearGuestCart}>Clear Cart</button>
        </div>
      </div>
    ) : (
      <p>Nothing</p>
    );

    return (
      <div>
        <h5>Your cart:</h5>
        <ul>{cards}</ul>
      </div>
    );
  }
}

export default GuestCart;
