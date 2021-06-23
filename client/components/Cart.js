import { CardContent } from '@material-ui/core';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  fetchCart,
  decreasedFromCart,
  addedToCart,
  removedFromCart,
} from '../store/cart';

class Cart extends Component {
  constructor() {
    super();
    this.state = {};
    this.handleSubtract = this.handleSubtract.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleRemoveFromCart = this.handleRemoveFromCart.bind(this);
    this.clearCart = this.clearCart.bind(this);
  }

  componentDidMount() {
    console.log('mounting userID->', this.props);
    let userId = this.props.user.id;
    this.props.fetchCart(userId);
  }

  handleSubtract(event) {
    const userId = this.props.user.id;
    const cardId = event.target.value;
    console.log('cardId->', cardId);
    this.props.decreasedFromCart(userId, cardId);
  }

  handleAdd(event) {
    const userId = this.props.user.id;
    const cardId = event.target.value;
    console.log('cardId->', cardId);
    this.props.addedToCart(userId, cardId);
  }

  handleRemoveFromCart(event) {
    const userId = this.props.user.id;
    const cardId = event.target.value;
    this.props.removedFromCart(userId, cardId);
  }

  clearCart() {
    console.log('this.props.cart->', this.props.cart);
    let userId = this.props.user.id;
    this.props.cart.orderItems = [];
    this.props.fetchCart(userId);
  }

  render() {
    const { orderItems, total } = this.props.cart;
    const hasOrderItems = orderItems && orderItems.length;
    // console.log("order items?->", orderItems);
    let items = hasOrderItems ? (
      <div>
        {orderItems.map((objectItem) => {
          // console.log("objectItem qty ->", objectItem);
          return (
            <div key={objectItem.card.id}>
              <div>
                <img src={objectItem.card.imgUrl} />

                <Link to={`/cards/${objectItem.card.id}`}>
                  <p>Name: {objectItem.card.name}</p>
                </Link>
                <p>Description: {objectItem.card.description}</p>
                <p>Price: {'$' + (objectItem.price / 100).toFixed(2)}</p>
                <p>Quantity: {objectItem.quantity}</p>

                <button
                  value={objectItem.cardId}
                  onClick={this.handleAdd}
                  disabled={this.props.cartStatus === 'LOADING'}
                >
                  +
                </button>
                <button
                  value={objectItem.cardId}
                  onClick={this.handleSubtract}
                  disabled={this.props.cartStatus === 'LOADING'}
                >
                  -
                </button>
                <button
                  value={objectItem.cardId}
                  onClick={this.handleRemoveFromCart}
                  disabled={this.props.cartStatus === 'LOADING'}
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}

        <div>
          <p>
            <button
              onClick={this.clearCart}
              disabled={this.props.cartStatus === 'LOADING'}
            >
              Clear Cart
            </button>
          </p>
        </div>
      </div>
    ) : (
      <p>Cart is Empty</p>
    );

    return (
      <div>
        <h5>You have ordered:</h5>
        <ul>{items}</ul>
        <h5>Total: {'$' + (total / 100).toFixed(2)}</h5>
        <button type="submit" className="checkout">
          <Link to="/checkout">Checkout</Link>
        </button>
      </div>
    );
  }
}

const mapState = (state) => {
  console.log('state->', state);
  return {
    cart: state.cart,
    user: state.auth,
    cartStatus: state.cartStatus,
  };
};

const mapDispatch = (dispatch) => {
  return {
    fetchCart: (userId) => dispatch(fetchCart(userId)),
    decreasedFromCart: (userId, cardId) =>
      dispatch(decreasedFromCart(userId, cardId)),
    addedToCart: (userId, cardId) => dispatch(addedToCart(userId, cardId)),
    removedFromCart: (userId, cardId) =>
      dispatch(removedFromCart(userId, cardId)),
  };
};

export default connect(mapState, mapDispatch)(Cart);
