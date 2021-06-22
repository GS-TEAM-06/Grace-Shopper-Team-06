import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchCards } from "../store/cards";
import { addedToCart } from "../store/cart";
import { deleteCardThunk } from "../store/card";
import { Link } from "react-router-dom";
import Home from "./Home";

class Cards extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.handleSubmit = this.createCardClick(this);
  }

  componentDidMount() {
    this.props.fetchCards();
  }

  handleClick() {
    this.props.addedToCart(cardId);
  }

  handleSubmit(event, CardId) {
    event.preventDefault();
    this.props.deleteCard(CardId);
  }

  render() {
    const { isLoggedIn } = this.props;
    const { user } = this.props;
    const { cards } = this.props;
    return (
      <div>
        <div>
          {isLoggedIn ? (
            <div>
              <Home />
            </div>
          ) : (
            <div>
              <h3>Welcome, Guest</h3>
            </div>
          )}
        </div>
        {cards.map((card) => {
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
              {user.admin ? (
                <button
                  type="submit"
                  className="remove"
                  onClick={(event) => handleSubmit(event, card.id)}
                >
                  X
                </button>
              ) : (
                <div />
              )}
            </div>
          );
        })}
        {isLoggedIn && user.admin ? (
          <div>
            <h1>CREATE NEW CARD</h1>
            <CreateCard history={this.props.history} />
          </div>
        ) : (
          <div />
        )}
      </div>
    );
  }
}

const mapState = (state) => {
  return {
    cards: state.cards,
    user: state.user,
  };
};

const mapDispatch = (dispatch, { history }) => {
  return {
    addedToCart: (cardId) => dispatch(addedToCart(cardId)),
    fetchCards: () => dispatch(fetchCards()),
    deleteCard: (cardId) => dispatch(deleteCardThunk(cardId)),
  };
};

export default connect(mapState, mapDispatch)(Cards);
