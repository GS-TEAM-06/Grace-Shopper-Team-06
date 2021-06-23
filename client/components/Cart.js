import { CardContent } from "@material-ui/core";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchCart,
  decreasedFromCart,
  addedToCart,
  removedFromCart,
  clearedCart,
} from "../store/cart";

class Cart extends Component {
  constructor() {
    super();
    this.state = {};
    this.handleSubtract = this.handleSubtract.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
    this.handleRemoveFromCart = this.handleRemoveFromCart.bind(this);
    this.handleClearCart = this.handleClearCart.bind(this);
  }

  componentDidMount() {
    let userId = this.props.user.id;
    this.props.fetchCart(userId);
  }

  handleSubtract(event) {
    const userId = this.props.user.id;
    const cardId = event.target.value;
    this.props.decreasedFromCart(userId, cardId);
  }

  handleAdd(event) {
    const userId = this.props.user.id;
    const cardId = event.target.value;
    this.props.addedToCart(userId, cardId);
  }

  handleRemoveFromCart(event) {
    const userId = this.props.user.id;
    const cardId = event.target.value;
    this.props.removedFromCart(userId, cardId);
  }

  handleClearCart() {
    const userId = this.props.user.id;
    this.props.clearedCart(userId);
  }

  render() {
    const { orderItems, total } = this.props.cart;
    const hasOrderItems = orderItems && orderItems.length;
    let items = hasOrderItems ? (
      <div>
        {orderItems.map((objectItem) => {
          console.log("What is objectItem--->", objectItem);
          return (
            <div key={objectItem.card.id}>
              <div>
                <img src={objectItem.card.imgUrl} />

                <Link to={`/cards/${objectItem.card.id}`}>
                  <p>Name: {objectItem.card.name}</p>
                </Link>
                <p>Description: {objectItem.card.description}</p>
                <p>Price: {"$" + (objectItem.card.price / 100).toFixed(2)}</p>
                <p>
                  Total: $
                  {(
                    (objectItem.card.price * objectItem.quantity) /
                    100
                  ).toFixed(2)}
                </p>
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
            <button onClick={this.handleClearCart}>Clear Cart</button>
          </p>
        </div>
      </div>
    ) : (
      <p>This cart is empty</p>
    );

    return (
      <div>
        <h5>Cart:</h5>
        <ul>{items}</ul>
        <button type="submit" className="checkout">
          <Link to="/checkout">Checkout</Link>
        </button>
        <h5>Total: {"$" + (total / 100).toFixed(2)}</h5>
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
    clearedCart: (userId) => dispatch(clearedCart(userId)),
  };
};

export default connect(mapState, mapDispatch)(Cart);
