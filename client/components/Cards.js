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

    this.state = { category: 'all' };

    this.handleClick = this.handleClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.categoryChange = this.categoryChange.bind(this);
  }

  componentDidMount() {
    this.props.fetchCards(this.state.category);
  }

  async addToGuestCart(cardId) {
    const { data } = await axios.get(`/api/cards/${cardId}`);
    let guestCart = JSON.parse(localStorage.getItem('guestCart'));
    guestCart.push(data);
    localStorage.guestCart = JSON.stringify(guestCart);
  }

  handleClick(event) {
    if (this.props.user.id) {
      const usersId = this.props.user.id;
      const cardsId = event.target.value;
      this.props.addedToCart(usersId, cardsId);
    } else {
      this.addToGuestCart(event.target.value);
    }
  }

  handleSubmit(event, CardId) {
    event.preventDefault();
    this.props.deleteCard(CardId);
    this.props.fetchCards(this.state.category);
  }

  categoryChange(event) {
    this.setState({ category: event.target.value });
    this.props.fetchCards(event.target.value);
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
        <label for="category">
          <select name="category" id="category" onChange={this.categoryChange}>
            <option value="all">All categories</option>
            <option value="Magic: The Gathering">Magic: The Gathering</option>
            <option value="Pokemon">Pokemon</option>
            <option value="Yu-Gi-Oh!">Yu-Gi-Oh!</option>
          </select>
        </label>
        {cards.map((card) => {
          return (
            <div key={card.id}>
              <h3>
                <Link to={`/cards/${card.id}`}>{card.name}</Link>
              </h3>
              <img src={card.imageUrl} />
              <h5>{'$' + (card.price / 100).toFixed(2)}</h5>
              <button type="button" value={card.id} onClick={this.handleClick}>
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
  };
};

const mapDispatch = (dispatch, { history }) => {
  return {
    addedToCart: (userId, cardId) => dispatch(addedToCart(userId, cardId)),
    fetchCards: (category) => dispatch(fetchCards(category)),
    deleteCard: (cardId) => dispatch(deleteCardThunk(cardId)),
  };
};

export default connect(mapState, mapDispatch)(Cards);
