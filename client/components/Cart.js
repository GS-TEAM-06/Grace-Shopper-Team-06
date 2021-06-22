import { CardContent } from "@material-ui/core";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { fetchCart, removedFromCart, addedToCart } from "../store/cart";

class Cart extends Component {
  constructor() {
    super();
    // this.handleDecreaseQuantity = this.handleDecreaseQuantity.bind(this);
    // this.handleIncreaseQuantity = this.handleIncreaseQuantity.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleAdd = this.handleAdd.bind(this);
  }

  componentDidMount() {
    console.log("mounting userID->", this.props);
    let userId = this.props.user.id;
    this.props.fetchCart(userId);
  }

  handleRemove(event) {
    const userId = this.props.user.id;
    const cardId = event.target.value;
    console.log("cardId->", cardId);
    this.props.removedFromCart(userId, cardId);
  }

  handleAdd(event) {
    const userId = this.props.user.id;
    const cardId = event.target.value;
    console.log("cardId->", cardId);
    this.props.addedToCart(userId, cardId);
  }
  // handleIncreaseQuantity(cardId) {
  //   this.props.addedQty(cardId);
  // }

  // handleDecreaseQuantity(cardId) {
  //   this.props.subtractedQty(cardId);
  // }

  render() {
    const { orderItems } = this.props.cart;
    const hasOrderItems = orderItems && orderItems.length;
    console.log("order items?->", orderItems);
    let items = hasOrderItems ? (
      orderItems.map((objectItem) => {
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
              <button value={objectItem.cardId} onClick={this.handleRemove}>
                -
              </button>
            </div>
          </div>
        );
      })
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
  console.log("State of Cart->", state);
  return {
    cart: state.cart,
    user: state.auth,
  };
};

const mapDispatch = (dispatch) => {
  return {
    fetchCart: (userId) => dispatch(fetchCart(userId)),
    removedFromCart: (userId, cardId) =>
      dispatch(removedFromCart(userId, cardId)),
    addedToCart: (userId, cardId) => dispatch(addedToCart(userId, cardId)),

    // addedQuantity: (cardId) => {
    //   dispatch(addedQty(cardId));
    // },
    // subtractedQty: (cardId) => {
    //   dispatch(subtractedQty(cardId));
    // },
  };
};

export default connect(mapState, mapDispatch)(Cart);
