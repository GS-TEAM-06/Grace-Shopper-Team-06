import React, {Component} from "react";
import {Link} from "react-router-dom";
import axios from "axios";

class GuestCart extends Component {
    constructor() {
        super();
        this.fetchGuestCart = this.fetchGuestCart.bind(this)
        this.removeFromGuestCart = this.removeFromGuestCart.bind(this)
        this.clearGuestCart = this.clearGuestCart.bind(this)
    }

    fetchGuestCart() {
        const guestCart = JSON.parse(localStorage.getItem("guestCart"))
        return guestCart;
    }

    async removeFromGuestCart(evt) {
        const { card } = await axios.get(`/api/cards/${evt.target.value}`);
        let guestCart = JSON.parse(localStorage.getItem('guestCart'))
        let index = guestCart.indexOf(card)
        guestCart.splice(index, 1)
    }
    
    clearGuestCart() {
        const emptyGuestCart = []
        localStorage.guestCart = JSON.stringify(emptyGuestCart);
    }

  render() {
    let guestCart = this.fetchGuestCart();
    let cards = guestCart.length ? (
      <div>
        {guestCart.map((card) => {
          return (
            <div key={guestCart.indexOf(card)}>
                  <div>
                    <img src={card.imgUrl} />
                  </div>
                  <Link to={`/cards/${card.id}`}>
                    <p>{card.name}</p>
                  </Link>
                  <p>{card.description}</p>
                  <p>{card.price}</p>
                  <button value={card.id} onClick={this.removeFromGuestCart}>Remove</button>
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
