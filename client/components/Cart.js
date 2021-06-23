import { CardContent } from "@material-ui/core";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchCart,
  decreasedFromCart,
  addedToCart,
  removedFromCart,
} from "../store/cart";

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
    console.log("mounting userID->", this.props);
    let userId = this.props.user.id;
    this.props.fetchCart(userId);
  }

  handleSubtract(event) {
    const userId = this.props.user.id;
    const cardId = event.target.value;
    console.log("cardId->", cardId);
    this.props.decreasedFromCart(userId, cardId);
  }

  handleAdd(event) {
    const userId = this.props.user.id;
    const cardId = event.target.value;
    console.log("cardId->", cardId);
    this.props.addedToCart(userId, cardId);
  }

  handleRemoveFromCart(event) {
    const userId = this.props.user.id;
    const cardId = event.target.value;
    this.props.removedFromCart(userId, cardId);
  }

  clearCart() {
    console.log("this.props.cart->", this.props.cart);
    let userId = this.props.user.id;
    this.props.cart.orderItems = [];
    this.props.fetchCart(userId);
  }

  render() {
    const { orderItems } = this.props.cart;
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
                <p>Price: {objectItem.card.price}</p>
                <p>Quantity: {objectItem.quantity}</p>

                <button value={objectItem.cardId} onClick={this.handleAdd}>
                  +
                </button>
                <button value={objectItem.cardId} onClick={this.handleSubtract}>
                  -
                </button>
                <button
                  value={objectItem.cardId}
                  onClick={this.handleRemoveFromCart}
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}

        <div>
          <p>
            <button onClick={this.clearCart}>Clear Cart</button>
          </p>
        </div>
      </div>
    ) : (
      <p>Nothing</p>
    );

    return (
      <div>
        <h5>You have ordered:</h5>
        <ul>{items}</ul>
      </div>
    );
  }
}

const mapState = (state) => {
  console.log("state->", state);
  return {
    cart: state.cart,
    user: state.auth,
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
