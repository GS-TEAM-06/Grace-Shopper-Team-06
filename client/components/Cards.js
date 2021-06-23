import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchCards } from '../store/cards';
import { addedToCart } from '../store/cart';
import { deleteCardThunk } from '../store/card';
import { Link } from 'react-router-dom';
import Home from './Home';
import axios from 'axios';
import CreateCard from './CreateCard';

class Cards extends Component {
  constructor(props) {
    super(props);

    this.state = { category: 'all', addQty: {} };

    this.handleClick = this.handleClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.categoryChange = this.categoryChange.bind(this);
  }

  componentDidMount() {
    this.props.fetchCards(this.state.category);
  }

  async addToGuestCart(cardId, cardQty) {
    if (!cardQty) {
      cardQty = 1;
    }
    cardQty = Number(cardQty);
    const { data } = await axios.get(`/api/cards/${cardId}`);
    let guestCart = JSON.parse(localStorage.getItem('guestCart'));
    let guestCartId = guestCart.map((card) => card.id);
    let index = guestCartId.indexOf(data.id);
    if (index === -1) {
      data.quantity = cardQty;
      guestCart.push(data);
    } else {
      guestCart[index].quantity = Number(guestCart[index].quantity) + cardQty;
    }
    localStorage.guestCart = JSON.stringify(guestCart);
  }

  handleClick(event) {
    event.preventDefault();
    const cardsId = event.target.value;
    if (this.state.addQty[cardsId] == 0) return;
    if (this.props.user.id) {
      const usersId = this.props.user.id;
      this.props.addedToCart(usersId, cardsId, this.state.addQty[cardsId]);
    } else {
      this.addToGuestCart(event.target.value, this.state.addQty[cardsId]);
    }
  }

  handleSubmit(event, CardId) {
    console.log(event);
    event.preventDefault();
    this.props.deleteCard(CardId);
    this.props.fetchCards(this.state.category);
  }

  categoryChange(event) {
    event.preventDefault();
    this.setState({ category: event.target.value });
    this.props.fetchCards(event.target.value);
  }

  handleQtyChange(event, cardId) {
    this.setState({ addQty: { ...{ [cardId]: event.target.value } } });
  }

  render() {
    const { isLoggedIn } = this.props;
    const { user } = this.props;
    const { cards } = this.props;
    console.log('This.props.cartStatus: ', this.props.cartStatus);
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
        <select name="category" id="category" onChange={this.categoryChange}>
          <option value="all">All categories</option>
          <option value="Magic: The Gathering">Magic: The Gathering</option>
          <option value="Pokemon">Pokemon</option>
          <option value="Yu-Gi-Oh!">Yu-Gi-Oh!</option>
        </select>
        {cards.map((card) => {
          return (
            <div key={card.id}>
              <h3>
                <Link to={`/cards/${card.id}`}>{card.name}</Link>
              </h3>
              <img src={card.imageUrl} />
              <h5>{'$' + (card.price / 100).toFixed(2)}</h5>

              {/* add given quantity to cart */}

              <form>
                <input
                  type="text"
                  size="1"
                  value={
                    !this.state.addQty[card.id] ? 1 : this.state.addQty[card.id]
                  }
                  onChange={(event) => this.handleQtyChange(event, card.id)}
                />
                <button
                  type="submit"
                  value={card.id}
                  onClick={this.handleClick}
                  disabled={this.props.cartStatus === 'LOADING'}
                >
                  Add To Cart
                </button>

                {user.admin ? (
                  <button
                    type="submit"
                    className="remove"
                    onClick={(event) => this.handleSubmit(event, card.id)}
                  >
                    X
                  </button>
                ) : (
                  <div />
                )}
              </form>
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
    user: state.auth,
    cartStatus: state.cartStatus,
  };
};

const mapDispatch = (dispatch, { history }) => {
  return {
    addedToCart: (userId, cardId, qty) =>
      dispatch(addedToCart(userId, cardId, qty)),
    fetchCards: (category) => dispatch(fetchCards(category)),
    deleteCard: (cardId) => dispatch(deleteCardThunk(cardId)),
  };
};

export default connect(mapState, mapDispatch)(Cards);
