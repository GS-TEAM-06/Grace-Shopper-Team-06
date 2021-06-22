import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchCards } from "../store/cards";
import { addedToCart } from "../store/cart";
import { Link } from "react-router-dom";
import Home from "./Home";
import axios from "axios";

class Cards extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.props.fetchCards();
  }

  async addToGuestCart(cardId) {
    const { data } = await axios.get(`/api/cards/${cardId}`);
    let guestCart = JSON.parse(localStorage.getItem('guestCart'))
    guestCart.push(data)
    localStorage.guestCart = JSON.stringify(guestCart)
}

  handleClick(event) {
      if (this.props.user.id) {
          const usersId = this.props.user.id;
          const cardsId = event.target.value;
          this.props.addedToCart(usersId, cardsId);
      } else {
        this.addToGuestCart(event.target.value)
      }
  }

  render() {
    return (
      <div>
        <div>
          {this.props.isLoggedIn ? (
            <div>
              <Home />
            </div>
          ) : (
            <div>
              <h3>Welcome, Guest</h3>
            </div>
          )}
        </div>
        {this.props.cards.map((card) => {
          return (
            <div key={card.id}>
              <h3>
                <Link to={`/cards/${card.id}`}>{card.name}</Link>
              </h3>
              <img src={card.imageUrl} />
              <h5>{card.price}</h5>
              <button type="button" value={card.id} onClick={this.handleClick}>
          Add To Cart
        </button>
            </div>
          );
        })}
      </div>
    );
  }
}

const mapState = (state) => {
  return {
    cards: state.cards,
    user: state.auth
  };
};

const mapDispatch = (dispatch) => {
  return {
    addedToCart: (userId, cardId) => dispatch(addedToCart(userId, cardId)),
    fetchCards: () => dispatch(fetchCards()),
  };
};

export default connect(mapState, mapDispatch)(Cards);
