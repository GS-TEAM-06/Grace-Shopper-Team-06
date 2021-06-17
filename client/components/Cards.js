import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchCards } from "../store/cards";
import { addedToCart } from "../store/cart";
import { Link } from "react-router-dom";
import Home from "./Home";

class Cards extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.props.fetchCards();
  }

  handleClick() {
    this.props.addedToCart(cardId);
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
              <button type="button" onClick={this.handleClick}>
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
  };
};

const mapDispatch = (dispatch) => {
  return {
    addedToCart: (cardId) => dispatch(addedToCart(cardId)),
    fetchCards: () => dispatch(fetchCards()),
  };
};

export default connect(mapState, mapDispatch)(Cards);
